# Promise

[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469)

[后盾人 - 手写 Promise](https://houdunren.gitee.io/note/js/17%20Promise%E6%A0%B8%E5%BF%83.html)

[面试官：“你能手写一个 Promise 吗”](https://zhuanlan.zhihu.com/p/183801144)

### 整体思路

1. 状态机，设静态状态属性；构造函数，包含状态，值，调用函数

2. `resolve` 和 `reject` 只能修改一次

3. 微任务的执行次序

   (网上比较多使用 `setTimeout` 来处理此处的异步，还原为微任务可使用 `queueMicrotask` 或 `mutationObserver`)

4. 加入回调队列，处理异步操作

   `then` 后为微任务；`resolve` 或 `reject` 前后的同步代码会先执行完

   => `then` 中对函数进行包裹，在 `resolve` / `reject` 中对代码进行包裹

5. 链式调用，返回 `Promise`

   当前返回的 `Promise` 状态与前一个无关

6. 处理值透传

   判断传入的 `resolve` 和 `reject` 是否为函数

7. 处理返回值类型

   判断是否为 `Promise` 

8. 添加返回约束

   避免递归调用自己

9. 添加静态方法 `resolve`  / `reject`

   返回一个 `Promise` ，注意判断返回值类型

10. 添加静态方法 `all`

    用一数组保存 `promise` 结果，只有所有均为 `fulfilled` 才会 `resolve`

11. 添加静态方法 `race`

    只理第一个结果，后面均忽略

12. 添加原型方法 `finally`

    无论结果是 `fulfilled` 或者是 `rejected`，都会执行指定的回调函数

    回调不接受任何参数，最终返回的默认会是一个上一次的Promise对象值

13. 添加原型方法 `catch`

    返回 `Promise`，处理拒绝情况，行为与 `then` 相似

### 最终代码

```javascript
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.value = null;
    this.callbacks = [];
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (value) => {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;
      setTimeout(() => {
        this.callbacks.forEach(cb => {
          cb.onResolved(value);
        });
      });
    }
  }

  reject = (reason) => {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.value = reason;
      setTimeout(() => {
        this.callbacks.forEach(cb => {
          cb.onRejected(reason);
        });
      });
    }
  }

  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      if(value instanceof MyPromise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      if (reason instanceof MyPromise) {
        reason.then(resolve, reject);
      } else {
        reject(reason);
      }
    })
  }

  static all(promises) {
    const resolves = [];
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolves.push(value);
            if (resolves.length === promises.length) {
              resolve(resolves);
            }
          },
          reason => {
            reject(reason);
          }
        )
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolve(value);
          },
          reason => {
            reject(reason);
          }
        )
      })
    })
  }

  parse(nextPromise, result, resolve, reject) {
    if (nextPromise === result) {
      throw new TypeError('Chaining cycle detected for promise');
    }
    try {
      if (result instanceof MyPromise) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }

  then(onResolved, onRejected) {
    if (typeof onResolved != "function") {
      onResolved = value => value;
    }
    if (typeof onRejected != "function") {
      onRejected = error => {throw new Error(error)};
    }
    let nextPromise = new MyPromise((resolve, reject) => {
      if (this.status === MyPromise.PENDING) {
        this.callbacks.push({
          // 注意此处用箭头函数，如用普通函数，会取不到 parse 方法
          onResolved: (value) => {
            this.parse(nextPromise, onResolved(value), resolve, reject);
          },
          onRejected: (value) => {
            this.parse(nextPromise, onRejected(value), resolve, reject);
          }
        })
      }
      if (this.status === MyPromise.FULFILLED) {
        setTimeout(() => {
          this.parse(nextPromise, onResolved(this.value), resolve, reject);
        });
      }
      if (this.status === MyPromise.REJECTED) {
        setTimeout(() => {
          this.parse(nextPromise, onRejected(this.value), resolve, reject);
        });
      }
    })
    return nextPromise;
  }

  finally(onFinally) {
    return this.then(
      value => {
        return MyPromise.resolve(onFinally()).then(() => value)
      }, 
      reason => {
        return MyPromise.resolve(onFinally()).then(null, reason);
      }
    )
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}
```

```javascript
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise;
```



### 带并发限制的异步调度器

[头条前端笔试题 - 实现一个带并发限制的PROMISE异步调度器](https://www.freesion.com/article/28351068595/)

**适用场景**

文件分片上传，导致有多个并发请求