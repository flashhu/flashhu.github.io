# 设计模式

[观察者模式 vs 发布-订阅模式](https://juejin.cn/post/6844903513009422343)

观察者模式/发布订阅模式区别：

* 在**观察者**模式中，观察者是知道Subject的，Subject一直保持对观察者进行记录。然而，在**发布订阅**模式中，发布者和订阅者**不知道对方的存在**。它们只有通过消息代理进行通信。

* 在**发布订阅**模式中，组件是松散耦合的，正好和观察者模式相反。

* **观察者模式**大多数时候是**同步**的，比如当事件触发，Subject就会去调用观察者的方法。而**发布-订阅**模式大多数时候是**异步的**（使用消息队列）。



## 1. 观察者模式

[JavaScript 设计模式核⼼原理与应⽤实践 - 观察者模式](https://juejin.cn/book/6844733790204461070/section/6844733790275813390)

```javascript
// 定义发布者类
class Publisher {
  constructor() {
    this.observers = []
    console.log('Publisher created')
  }
  // 增加订阅者
  add(observer) {
    console.log('Publisher.add invoked')
    this.observers.push(observer)
  }
  // 移除订阅者
  remove(observer) {
    console.log('Publisher.remove invoked')
    this.observers.forEach((item, i) => {
      if (item === observer) {
        this.observers.splice(i, 1)
      }
    })
  }
  // 通知所有订阅者
  notify() {
    console.log('Publisher.notify invoked')
    this.observers.forEach((observer) => {
      observer.update(this)
    })
  }
}
```

```javascript
// 定义订阅者类
class Observer {
    constructor() {
        console.log('Observer created')
    }

    update() {
        console.log('Observer.update invoked')
    }
}
```



## 2. 发布订阅 Emitter

```javascript
// 发布订阅模式
class EventEmitter {
  constructor() {
    // 事件对象，存放订阅的名字和事件  如:  { click: [ handle1, handle2 ]  }
    this.events = {};
  }
  // 订阅事件的方法
  on(eventName, callback) {
    if (!this.events[eventName]) {
      // 一个名字可以订阅多个事件函数
      this.events[eventName] = [callback];
    } else {
      // 存在则push到指定数组的尾部保存
      this.events[eventName].push(callback);
    }
  }
  // 触发事件的方法
  emit(eventName, ...rest) {
    // 遍历执行所有订阅的事件
    this.events[eventName] &&
      this.events[eventName].forEach(f => f.apply(this, rest));
  }
  // 移除订阅事件
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        f => f != callback
      );
    }
  }
  // 只执行一次订阅的事件，然后移除
  once(eventName, callback) {
    // 绑定的时fn, 执行的时候会触发fn函数
    const fn = (...rest) => {
      callback.apply(this, rest) // fn函数中调用原有的callback
      this.remove(eventName, fn) // 删除fn, 再次执行的时候之后执行一次
    }
    this.on(eventName, fn)
  }
}
```

