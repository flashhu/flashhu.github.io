> 手写的核心是理解，别背！

[22 道高频 JavaScript 手写面试题及答案](https://juejin.cn/post/6844903911686406158)

[死磕 36 个 JS 手写题（搞懂后，提升真的大）](https://juejin.cn/post/6946022649768181774)

[32个手写JS，巩固你的JS基础（面试高频）](https://juejin.cn/post/6875152247714480136)



## 一、对象

### 1. `new`

[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)

> If Type(proto) is not Object, set the [[Prototype]] internal property of obj to the standard built-in Object prototype object as described in 15.2.4.
>
> —— http://es5.github.io/#x13.2.2

使用 `new` 新建一原型为 `null` 的实例，实例的 `__proto__` 值会变为 `Object.prototype`

```javascript
function myNew() {
    // 1. 新建对象
    // var obj = new Object();
    // 2. 连接原型链
    // 2.1 取得构造函数
    var Constructor = [].shift.call(arguments);
    // 2.2 为新建对象的 [[prototype]] 赋值
    // obj.__proto__ = Constructor.prototype;
    // Object.setPrototypeOf(obj, Constructor.prototype);
    var obj = Object.create(Constructor.prototype === null ? Object.prototype : Constructor.prototype);
    // 3. 调用构造函数，并改变 this 指向
    var ret = Constructor.apply(obj, arguments);
    // 4. 如构造函数返回结果为对象(非 null)，则直接返回，否则返回新建对象，忽略返回值
    return (typeof result2 === 'function' || (typeof result2 === 'object' && result !== null)) ? ret : obj;
}
```



### 2. instanceof

[instanceOf原理，手写一个instanceOf?(快手）](https://github.com/qappleh/Interview/issues/170)

[(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.cn/post/6844903974378668039#heading-15)

```javascript
// left 表示左表达式，right 表示右表达式
function myInstanceOf(left, right) {
    // 1. 如为基础类型，直接返回 false
    if ((typeof left !== 'object' && typeof left !== 'function') || left === null) {
        return false;
    }
    // 2. 取 right 的显示原型，left 的隐式原型
    var rightProto = right.prototype;
    // left = left.__proto__; 
    // ES6 写法
    left = Object.getPrototypeOf(left)
    // 3. 沿原型链，找是否出现该原型对象
    while ( true ) { 
        if ( left === null ) return false;
        if ( left === rightProto ) return true; 
        left = left.__proto__; 
    } 
}
```



### 3.  `Object.create`

[Object.create - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#polyfill)

**见 Object.assign 中提到的文章：如直接使用 `Object.create` 定义，则 `create` 会变为可枚举属性，因此如采用此种形式，必须使用 `Object.defineProperty` !**

```
> Object.getOwnPropertyDescriptor(Object, 'create')
< {writable: true, enumerable: false, configurable: true, value: ƒ}
```

> 手写的时候，如直接定义在 `Object` 上，要注意设置为不可枚举，即如下所示结构
>
> ```javascript
> Object.defineProperty(Object, "key", {
>     value: function (target) { 
>       ...
>     },
>     // 默认值是 false，即 enumerable: false
>     writable: true,
>     configurable: true
>   });
> ```

```javascript
function myCreate(proto, propertiesObject) {
    // 1. 验证 proto 为构造函数/对象(/null)
    if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object: ' + proto);
    // } else if (proto === null) {
        // 在 ES5 中 Object.create支持设置为[[Prototype]]为null，但因为那些ECMAScript5以前版本限制，此 polyfill 无法支持该特性。
        // throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    }
    // 2. 内部新建一构造函数
    function F() { }
    // 3. 将构造函数的原型指向传入的原型对象
    F.prototype = proto;
    // 4. 新建一构造函数的实例
    var obj = new F();
    // 5. 如为 null, 需要再将实例的原型指向 null。否则，使用 new 新建实例时，会将原型指向 Object.prototype
    if (proto === null) {
        obj.__proto__  = null;
    }
    // 6. 为实例添加属性
    if (propertiesObject) {
        Object.defineProperties(obj, propertiesObject)
    }
    return obj;
};
```

```javascript
Object.defineProperty(Object, 'myCreate', {
    value: function myCreate(proto, properties) {
        if(typeof proto !== 'function' && typeof proto !== 'object') {
            throw new TypeError('Object prototype may only be an Object or null:' + proto);
        }
        function F() {};
        F.prototype = proto;
        const obj = new F();
        if(proto === null) {
            obj.__proto__ = null;
        }
        if(properties) {
            Object.defineProperties(obj, properties);
        }
        return obj;
    },
    writable: true,
    configurable: true
})
```



### 4. 如何实现只读对象

> const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动,

```javascript
const constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
        if (obj[key] && typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    })
}
```

**扩展**

* [`Object.preventExtensions(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)：使对象不可添加新属性

  [`Object.isExtensible(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)

* [`Object.seal(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)：使对象不可添加新属性，不可再配置，只能修改当前可写的属性值

  [`Object.isSealed(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)

* [`Object.freeze(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)：使对象不能被修改（新增，删除，修改都不行，原型也不能修改）

  [`Object.isFrozen(obj)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)



### 5. Object.assign ？

[Object.assign](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

[【进阶4-2期】Object.assign 原理及其实现](https://github.com/yygmind/blog/issues/26)

> `Object(null)` 或 `Object(undefined)` 在实际测试时会返回 `{}`
>
> 但在标准中，一直到 ES10 中的 [ToObject](https://262.ecma-international.org/10.0/#table-13) 对于 `null`，`undefined` 都是返回 `TypeError` ?

第一个参数为目标对象，第二个及以后参数为源对象

参见 polyfill 实现可以发现，和使用 `for in` 实现浅拷贝几乎一致

* 判断目标对象类型，转为 Object 类型
* 依次遍历后续传入的源对象
* `for in` + `obj.hasOwnProperty` 进行浅拷贝

```javascript
Object.defineProperty(Object, "myAssign", {
    value: function myAssign(target) {
        // 判断 null + undefined
        if(target == null) { 
            throw new TypeError('Cannot convert undefined or null to object');
        }
        let res = Object(target);
        for(let i = 1;i < arguments.length;i ++) {
            const currentObj = arguments[i];
            // 处理非 null，undefined 的情况 
            if(currentObj != null) {
                for(let key in currentObj) {
                    // 源对象不一定能取到 hasOwnProperty，如当它的原型为 Object.create(null) 时
                    if(Object.prototype.hasOwnProperty.call(currentObj, key)) {
                        res[key] = currentObj[key];
                    }
                }
            }
        }
        return res;
    },
    writable: true,
    configurable: true
})
```



### 6. Object.is

[Object.is — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

[`Object.is` 与 `==`，`===` 区别](/language/JavaScript?id=_15-objectis-与-，-区别)

`Object.is(value1, value2)` 比较两个值是否为同个值

主要解决：

```
+0 === -0  // true
NaN === NaN // false
```

```javascript
Object.defineProperty(Object, 'myIs', {
    value: function (x, y) {
        if (x === y) {
            // 处理 +0, -0 
            return x !== 0  || 1 / x === 1 / y;
        } else {
            // 处理 NaN, NaN
            return x !== x && y !== y;
        }
    },
    writable: true,
    configurable: true
})
```



## 二、this

> 使用 `Date.now` 来保持键的唯一性，其实也是用了 ES6 的东西 orz

> 和上文同理，使用 `Object.defineProperty`  替代直接在原型上添加属性，三个方法获取属性描述符后，均为 `{writable: true, enumerable: false, configurable: true, value: ƒ}`

### 1.  `call` ？

[JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

核心思路为将 `bar.call(foo)` 转变为 `foo.bar()` 处理

> 待解决疑问：如何判断 call 是在严格模式下使用还是非严格模式？ call 中，this 只能取到调用 call 的函数

**ES3**

此处取参数都转为拼接 `arguments[i]` 的字符串再做处理

如直接取值拼接，在 `eval` 中，可能会被拼接为使用某变量，而非直接传入某值

```javascript
Function.prototype.call3 = function (context) {
    // 1. 处理缺省值
    // 非严格模式下，指定为 null 或 undefined 时会自动替换为指向全局对象；严格模式，则为 undefined
    context = Object(context) || window;
    // 2. 将调用 call 的函数设为对象的属性
    var fn = 'myCallFn';
    context[fn] = this;
    // 3. 得到传入的参数数组
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    // 4. 调用函数
    var result = eval('context[fn](' + args + ')');
    // 5. 删除属性
    delete context.fn
    // 6. 返回函数结果
    return result;
}
```

**ES6**

```javascript
Function.prototype.call6 = function (context) {
    // 1. 处理缺省值
    // 非严格模式下，指定为 null 或 undefined 时会自动替换为指向全局对象；严格模式，则为 undefined
    context = Object(context) || window;
    // 2. 将调用 call 的函数设为对象的属性
    let fn = Symbol();
    context[fn] = this;
    // 3. 得到传入的参数
    let args = [...arguments].slice(1);
    // 4. 调用函数
    let result = context[fn](...args);
    // 5. 删除新增的属性
    delete context[fn];
    // 6. 返回函数结果
    return result;
};
```

**Object.defineProperty**

```javascript
Object.defineProperty(Function.prototype, 'call3', {
    value: function (context) {
        context = Object(context) || window;
        var key = 'myCallFn';
        context[key] = this;
        var args = [];
        for(var i = 1;i < arguments.length;i ++) {
            args.push('arguments[' + i + ']');
        }
        var res = eval('context[key](' + args + ')');
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})

Object.defineProperty(Function.prototype, 'call6', {
    value: function (context) {
        context = Object(context) || window;
        const key = Symbol();
        context[key] = this;
        const args = [].slice.call(arguments, 1);
        const res = context[key](...args);
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})
```



### 2. `apply`

[JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

实现思路与 `call` 一致

**ES3**

`apply` 第二个参数为数组，因此可以直接作为一参数处理，不用 `arguments`

```javascript
Function.prototype.apply3 = function (context, arr) {
    // 1. 处理缺省值
    context = Object(context) || window;
    // 2. 将调用 apply 的函数设为对象的属性
    var fn = 'myApplyFn';
    context[fn] = this;
    // 3. 处理参数 + 4. 调用函数
    var res;
    if (!arr) {
        res = context[fn]();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        res = eval('context[fn](' + args + ')')
    }
    // 5. 删除属性
    delete context[fn];
    // 6. 返回结果
    return res;
}
```

**ES6**

```javascript
Function.prototype.apply6 = function (context, arr = []) {
    // 1. 处理缺省值
    context = Object(context) || window;
    // 2. 将调用 apply 的函数设为对象的属性
    let fn = Symbol();
    context[fn] = this;
    // 3. 处理参数 + 4. 调用函数
    let res = context[fn](...arr);
    // 5. 删除属性
    delete context[fn];
    // 6. 返回结果
    return res;
}
```

**Object.defineProperty**

```javascript
Object.defineProperty(Function.prototype, 'apply3', {
    value: function (context, args) {
        context = Object(context) || window;
        var key = 'myApplyFn';
        context[key] = this;
        var res = null;
        if(!args || args.length === 0) {
            res = context[key]();
        } else {
            var arr = [];
            for(var i = 0;i < args.length;i ++) {
                arr.push('args[' + i + ']');
            }
            res = eval('context[key](' + arr + ')');
        }
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})

Object.defineProperty(Function.prototype, 'apply6', {
    value: function (context, args = []) {
        context = Object(context) || window;
        const key = Symbol();
        context[key] = this;
        const res = context[key](...args);
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})
```



### 3.  ` bind`

[JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

[ `new` 和 `Object.create()` 的区别 ？](language/JavaScript?id=_1-new-和-objectcreate-的区别-？)

从上述的 `call`，`apply` 的思路中，扩展到 <u>返回一函数</u>

可以接着传参的特点，转换为 <u>两次参数拼接后传入函数</u>

作为构造函数时，`bind` 时指定的 `this` 值失效，扩展到 <u>利用 `Object.create` 的特点</u>

```javascript
Function.prototype.myBind = function (context) {
    // 0. 检查调用 bind 的是否为函数
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    // 1. 取到调用 bind 的函数及调用 bind 时传入的参数
    // arguments 为类数组对象
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    // 2. 得到待返回的函数
    var fBound = function () {
        // 2.1 取到调用返回函数时传入的参数, 将类数组对象转为数组
        var bindArgs = Array.prototype.slice.call(arguments);
        // 2.2 调用函数
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 3. 调整原型指向；此处不要使用引用赋值的形式，如：fBound.prototype = this.prototype
    fBound.prototype = Object.create(self.prototype)
    // 4. 返回函数
    return fBound;
}
```

```javascript
Object.defineProperty(Function.prototype, 'myBind', {
    value: function (context) {
        if(typeof this !== "function") {
            throw new TypeError(`${this}.bind is not a function`);
        }
        var self = this;
        var args = [].slice.call(arguments, 1);
        var fBound = function() {
            var bindArgs = [].slice.call(arguments);
            return self.apply(this instanceof fBound ? this: context, args.concat(bindArgs));
        }
        fBound.prototype = Object.create(self.prototype);
        return fBound;
    },
    writable: true,
    configurable: true
})
```



## 三、数组

在 polyfill 的实现中，比较常见的用法有:

* 借助 `index in obj` 来判断当前是不是为空元素

  如 `[,,,].length` 为 4，借助这种办法可以进行判断

* 借助 `o.length >>> 0` 来取长度，`>>>` 为无符号右移 0 位，主要用于保证转换后为正整数

  底层先将非 number 转为 number 类型，再将 number 类型转为 Unit 类型

### 1. `reduce`

[reduce - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

> 如果没有提供`initialValue`，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供`initialValue`，从索引0开始。

> 如为对象数组，必须传入初始值

*  **callback** 函数接收 4 个参数:

1. Accumulator (acc) (累计器)
2. Current Value (cur) (当前值)
3. Current Index (idx) (当前索引)
4. Source Array (src) (源数组)

* **initialValue**

  如没有提供，则使用数组第一个元素

polyfill：根据 `this` 取到数组，当入参为两个时，第二个入参作为初始值，否则将数组的首个非空元素作为初始值，再进行迭代，依次触发回调，更新累计器

```javascript
Object.defineProperty(Array.prototype, 'myReduce', {
    value: function (callback) {
        if(this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        } 
        if(typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }
        const o = Object(this);
        const len = o.length >>> 0;
        let currIndex = 0, accumulator = null;
        if(arguments.length >= 2) {
            accumulator = arguments[1];
        } else {
            while (currIndex < len && !(currIndex in o)) {
                currIndex ++;
            }
            accumulator = o[currIndex ++];
        }
        while (currIndex < len) {
            if (currIndex in o) {
                accumulator = callback(accumulator, o[currIndex], currIndex, o);
            }
            currIndex ++;
        }
        return accumulator;
    },
    writable: true,
    configurable: true
})
```



### 2. `forEach`

[forEach — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

* **callback** 函数接收 3 个参数:

1. currentValue：正在处理的当前元素

2. index：正在处理的当前元素的索引

3. array：正在操作的数组

* **thisArg** 指定 this 指向

polyfill：根据 `this` 取到数组，再进行迭代，依次触发回调（如传入第二个参数，需要再调整指向）

```javascript
Object.defineProperty(Array.prototype, 'myForEach', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError('this is null or undefined');
        }
        if(typeof callback !== 'function') {
            throw new TypeError(`${constructor} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length >>> 0;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        while (currIndex < len) {
            if(currIndex in obj) {
                callback.call(context, obj[currIndex], currIndex, obj);
            }
            currIndex ++;
        }
    },
    writable: true,
    configurable: true
})
```



### 3.  `map`

[map — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

参数和 `forEach` 差不多

polyfill：和 `forEach` 差不多，多了一个数组保存每次回调函数的返回值

```javascript
Object.defineProperty(Array.prototype, 'myMap', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError('this is null or undefined');
        }
        if(typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length >>> 0;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        let res = [];
        while (currIndex < len) {
            if(currIndex in obj) {
                res.push(callback.call(context, obj[currIndex], currIndex, obj));
            }
            currIndex ++;
        }
        return res;
    },
    writable: true,
    configurable: true
})
```



### 4. filter

[filter — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

参数和 `forEach` 差不多，回调函数返回 `true`，`false` 决定元素留不留

polyfill：和 `forEach` 差不多，在遍历时，根据回调函数的返回值，决定当前元素是否要被保留

```true
Object.defineProperty(Array.prototype, 'myFilter', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError('this is null or undefined');
        }
        if(typeof constructor !== 'function') {
            throw new TypeError(`${constructor} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        let res = [];
        while(currIndex < len) {
            if(currIndex in obj) {
                if (callback.call(context, obj[currIndex], currIndex, obj)) {
                    res.push(obj[currIndex]);
                }
            }
            currIndex ++;
        }
        return res;
    },
    writable: true,
    configurable: true
})
```



### 5. some

[some — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

测试数组中是不是至少有1个元素通过了被提供的函数测试，返回 `true` 或 `false`

参数和 `forEach` 差不多

polyfill：和 `filter` 差不多，将保存值的部分，改回返回 `true` 就变成了 `some` 的实现



### 6. 数组去重

> [Array.from — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)：将伪数组对象或可迭代对象，转换为数组（浅拷贝）

去重基本数据类型

1. 利用 `Set` 的特点
2. 借助 `filter` 或 `reduce`
3. 借助 `Object` 记录哪些出现过

去重对象类型

1. 借助对象中 `key` 标识

```javascript
function uniqueArray1 (target) {
    // return Array.from(new Set(target));
    return [...new Set(target)];
}

function uniqueArray2 (target) {
    return target.reduce((arr, curr) => {
        return arr.indexOf(curr) === -1 ? arr.concat(curr): arr;
    }, [])
}

function uniqueArray3 (target) {
    return target.filter((curr, index, arr) => arr.indexOf(curr) === index);
}

function uniqueArray4 (target) {
    const dic = {};
    const res = [];
    for(var i = 0;i < target.length;i ++) {
        if(!dic[target[i]]) {
            res.push(target[i]);
            dic[target[i]] = true;
        }
    }
    return res;
}

function uniquArray5 (target, key) {
    const dic = new Map();
    return target.reduce((arr, curr) => {
        if(dic.has(curr[key])) {
            return arr;
        } else {
            dic.set(curr[key], true);
            return [...arr, curr];
        }
    }, []);
}
```



### 7. 数组扁平化

ES10 中有了 [`Array.prototype.flat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

其中一种替代方案为借助 `reduce` 维护最终的结果，中间进行递归

```javascript
function flatDeep(arr, d = 1) {
    if(d > 0) {
        return arr.reduce((res, curr) => (
            res.concat(Array.isArray(curr) ? flatDeep(curr, d - 1): curr)
        ), [])
    } else {
        return arr;
    }
};
```



### 8. 类数组转为数组

> 常见的有 arguments, DOM 操作返回的结果

* `Array.from(target)`
* `[... target]`
* `Array.prototype.slice.call(target)`
* `Array.prototype.concat.apply([], target)`



## 四、JSON

### 1. JSON.stringify

[JSON.stringify() — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

[实现一个 JSON.stringify](https://github.com/YvetteLau/Step-By-Step/issues/39#issuecomment-508327280)

**主要功能**

将一个 JavaScript 对象或值转换为 JSON 字符串，`JSON.stringify(value[, replacer [, space]])`

* **value**：将要序列化成 一个 JSON 字符串的值。

* replacer：如为函数，则值被序列化前会经函数处理；如为数组，则只有在数组中的属性名才会被序列化

* space：指定缩进用的空白字符串。如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。

**主要特点**

基本数据类型及函数：

- NaN、Infinity、null 序列化返回 "null"
- **function 、undefined 、symbol 序列化返回 undefined（非字符串）**
- string 转换之后仍是string，需要额外加上引号（和其他做区分
- BigInt 不支持序列化，抛出 TypeError
- boolean，number (除了 NaN 和 Infinity)序列化返回转为字符串后的值

对象类型(非函数)

* 数组

  * **值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null"** 
  * 值为 RegExp 对象，则返回 {} (类型是 string)
  * 值为 Date 对象，返回 Date 的 toJSON 字符串值（绝对时间）
  * 其他类型保持原有值

  ```javascript
  console.log(JSON.stringify([null, undefined, 1, '1', false, Symbol(), function(){}, /test/, new Date()]))
  // "[null,null,1,"1",false,null,null,{},"2021-04-17T11:56:55.503Z"]"
  ```

- 对象
  - 如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
  - 所有**以 symbol 为属性键的属性都会被完全忽略掉**
  - 如果**属性值中出现了 undefined、任意的函数以及 symbol 值，忽略**。

对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```javascript
function jsonStringify(data) {
    let dataType = typeof data;
    
    if (dataType !== 'object') {
		// 一、处理除 null 外的基础数据类型及 function
        if (Number.isNaN(data) || data === Infinity) {
            // 1. NaN、Infinity 序列化返回 "null"
            return "null";
        } else if (dataType === 'function' || dataType === 'undefined' || dataType === 'symbol') {
            // 2. function 、undefined 、symbol 序列化返回 undefined
            return undefined;
        } else if (dataType === 'string') {
            // 3. string 序列化添加引号
            return '"' + data + '"';
        } else if (dataType === 'bigint') {
            // 4. bigint 抛出错误
            throw new TypeError('Do not know how to serialize a BigInt');
        } else {
            // 5. boolean、其他 number 返回 String()
        	return String(result);
        }
    } else if (dataType === 'object') {
        // 二、处理 null 及对象类型
        if (data === null) {
            // 1. null 序列化返回 “null”
            return "null"
        } else if (data.toJSON && typeof data.toJSON === 'function') {
            // 2. 包含 toJSON 则序列化 toJSON 结果
            return jsonStringify(data.toJSON());
        } else if (data instanceof Array) {
            let result = [];
            // 3. 如果是数组, toJSON 方法可以存在于原型链中
            data.forEach((item, index) => {
                if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
                    result[index] = "null";
                } else {
                    result[index] = jsonStringify(item);
                }
            });
            result = "[" + result + "]";
            return result.replace(/'/g, '"');
            
        } else {
            // 4. 普通对象
            /**
             * 循环引用抛错(暂未检测，循环引用时，堆栈溢出)
             * symbol key 忽略
             * undefined、函数、symbol 为属性值，被忽略
             */
            let result = [];
            Object.keys(data).forEach((item, index) => {
                if (typeof item !== 'symbol') {
                    //key 如果是symbol对象，忽略
                    if (data[item] !== undefined && typeof data[item] !== 'function'
                        && typeof data[item] !== 'symbol') {
                        //键值如果是 undefined、函数、symbol 为属性值，忽略
                        result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
                    }
                }
            });
            return ("{" + result + "}").replace(/'/g, '"');
        }
    }
}
```



### 2. JSON.parse

[JSON.parse() — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

[JSON.parse 三种实现方式](https://github.com/youngwind/blog/issues/115#issue-300869613)

[实现一个 JSON.parse](https://github.com/YvetteLau/Step-By-Step/issues/40#issuecomment-508786079)

**主要功能**

解析JSON字符串，构造由字符串描述的JavaScript值或对象，`JSON.parse(text[, reviver])`

* **text**，需要被解析的字符串
* reviver，转换器，修改解析生成的原始值

**主要方式**

* `eval`

  要在前后加上 `()`，如果不加，遇到 `{}` 会判成一个语句块，而不作为对象处理

  ```javascript
  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  
  if (
      rx_one.test(
          json.replace(rx_two, "@")
              .replace(rx_three, "]")
              .replace(rx_four, "")
      )
  ) {
      // 核心
      var obj = eval("(" +json + ")");
  }
  ```

* `new function`

  ```javascript
  var obj = (new Function('return ' + json))();
  ```

* 递归：逐个扫描字符再进行判断

* 状态机



## 五、深浅拷贝

### 1. 浅拷贝

[JavaScript专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)

[forin，Object.keys和Object.getOwnPropertyNames的区别](language/JavaScript?id=_6-for-in，objectkeys，objectgetownpropertynames-区别)

本质：遍历对象属性，可以使用 `Object.keys` 或 `for in` 配合 `obj.hasOwnProperty()`

数组 => 利用数组的一些方法比如：`slice`、`concat` 、展开语法返回一个新数组的特性来实现拷贝

对象 => 同理，如 `Object.assign`，展开语法

```javascript
var new_arr = arr.concat();
var new_arr = arr.slice();
var new_arr = [...arr];
var new_obj = Object.assign({}, obj);
var new_obj = {...obj};
```

```javascript
var shallowCopy = function(obj) {
    // 0. 检查类型：只拷贝对象
    if (typeof obj !== 'object') return;
    // 1. 根据 obj 的类型判断是新建一个数组还是对象
    var newObj = Array.isArray(target) ? [] : {};
    // 2. 遍历 obj 的属性并进行拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```



### 2. 深拷贝

[深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

[【进阶4-3期】面试题之如何实现一个深拷贝 ](https://github.com/yygmind/blog/issues/29)

[【进阶4-4期】Lodash是如何实现深拷贝的](https://github.com/yygmind/blog/issues/31)

[JavaScript专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)

[什么是尾递归 — 知乎](https://www.zhihu.com/question/20761771/answer/19996299)

[手写深克隆](https://juejin.cn/post/6844903911686406158#heading-3)

> 1. 参数是否做检验；类型判断逻辑是否严谨
> 2. 有没有考虑数组兼容
> 3. 递归爆栈 => 消除尾递归 / 循环
> 4. 循环引用，引用丢失（使用同一引用地址） => 暴力破解 / 循环检测

> 尾递归，比线性递归多一个参数，这个参数是上一次调用函数得到的结果
>
> 每次调用都在收集结果，避免了线性递归不收集结果只能依次展开消耗内存

#### JSON

> `JSON.stringify` 的特点：
>
> * 忽略 `undefined`，`symbol`，函数
> * 不能解决循环引用
> * 不能正确处理正则，正则表达式会变成一个空对象

优点是讨巧，简单，`JSON。stringify` 内部做了循环引用检测 ；

缺点为不支持拷贝函数，会丢失数据间的引用关系，内部使用的其实还是递归

```javascript
var new_data = JSON.parse(JSON.stringify(data));
```

#### 递归

* 当层级很深时，会发生栈溢出（爆栈）
* 不能解决循环引用

```javascript
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

function deepClone1(target) {
    if (!isObject(target)) return target;
    const res = Array.isArray(target) ? [] : {};
    Object.keys(target).forEach(key => {
        res[key] = isObject(target) ? deepClone1(target[key]): target[key];
    })
    return res;
}
```

#### 循环 + 数组

> 解决爆栈和引用问题

将源数据看成树结构，利用 DFS 或 BFS 进行复制

适合对象引用少的情况

存在问题：

* 没有针对具体的情况做处理，如此时 `function` 会不满足 `isObject` 的判断逻辑，而进行浅拷贝；此时 `RegExp` 满足 `isObject` 判断逻辑，而被初始化为 `{}` 等

```javascript
function deepClone2(target) {
    if (!isObject(target)) return target;
    const root = Array.isArray(target) ? [] : {};
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: target,
        }
    ];
    while (loopList.length) {
        const { parent, key, data } = loopList.pop();
        // 如 key 为 undefined 则表示拷贝到父元素，否则就拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = Array.isArray(data) ? [] : {};
        }
        Object.keys(data).forEach(key => {
            if(isObject(data[key])) {
                // 注意这里的 parent 是 res
                loopList.push({
                    parent: res,
                    key, 
                    data: data[key]
                })
            } else {
                res[key] = data[key];
            }
        })
    }
    return root;
}
```

```javascript
function deepClone2(target) {
    if (!isObject(target)) return target;
    const root = Array.isArray(target) ? [] : {};
    // 用于去重
    const uniqueList = [];
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: target,
        }
    ];
    while (loopList.length) {
        const { parent, key, data } = loopList.pop();
        // 如 key 为 undefined 则表示拷贝到父元素，否则就拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = Array.isArray(data) ? [] : {};
        }
        // 检查当前处理的值，是否为包含引用关系的对象
        const savedData = uniqueList.filter(v => v.source === data);
        if(savedData.length) {
            parent[key] = savedData[0].target;
            continue;
        }
        // 记录源数据中的值与克隆后数据的对应关系
        uniqueList.push({
            source: data,
            target: res
        })
        Object.keys(data).forEach(key => {
            if(isObject(data[key])) {
                // 注意这里的 parent 是 res
                loopList.push({
                    parent: res,
                    key, 
                    data: data[key]
                })
            } else {
                res[key] = data[key];
            }
        })
    }
    return root;
}
```

|          | clone        | cloneJSON    | cloneLoop | cloneForce   |
| :------- | :----------- | :----------- | :-------- | :----------- |
| 难度     | ☆☆           | ☆            | ☆☆☆       | ☆☆☆☆         |
| 兼容性   | ie6          | ie8          | ie6       | ie6          |
| 循环引用 | 一层         | 不支持       | 一层      | 支持         |
| 栈溢出   | 会           | 会           | 不会      | 不会         |
| 保持引用 | 否           | 否           | 否        | 是           |
| 适合场景 | 一般数据拷贝 | 一般数据拷贝 | 层级很多  | 保持引用关系 |



## 六、函数

### 1. 函数柯里化

**主要思路**

判断当前传入函数的参数个数 (args.length) 是否大于等于原函数所需参数个数 (fn.length) ，如果是，则执行当前函数；如果是小于，则返回一个函数

**不定长简易**

> 严格讲不算柯里化，为链式调用

整体思路为闭包加递归，自定义 `valueOf` 方法

```javascript
function add(sum) {
    var fn = function(n) {
        return add(sum + n);
    }

    fn.valueOf = function() {
        return sum;
    }

    return fn;
}

console.log(add(1)); // Function
console.log(+add(1)); // 1
console.log(+add(1)(2)); // 3
console.log(+add(1)(2)(3)); // 6
```

```javascript
function add() {
    const _args = [...arguments];
    function fn() {
        _args.push(...arguments);
        return fn;
    }
    fn.toString = function () {
        return _args.reduce((sum, cur) => sum + cur);
    }
    return fn;
}
```

**定长简易**

[现代 JavaScript 教程 - 柯里化](https://zh.javascript.info/currying-partials)

不支持乱序输入

```javascript
function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args);
        } else {
            return function (...args2) {
                return curried.call(this, ...args, ...args2);
            }
        }
    }
}
```

**定长详细**

[JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)

定长，支持乱序输入

```javascript
function curry(fn, args, holes) {
    length = fn.length;

    args = args || [];

    holes = holes || [];

    return function() {

        var _args = args.slice(0),
            _holes = holes.slice(0),
            argsLen = args.length,
            holesLen = holes.length,
            arg, i, index = 0;

        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
            if (arg === _ && holesLen) {
                index++
                if (index > holesLen) {
                    _args.push(arg);
                    _holes.push(argsLen - 1 + index - holesLen)
                }
            }
            // 处理类似 fn(1)(_) 这种情况
            else if (arg === _) {
                _args.push(arg);
                _holes.push(argsLen + i);
            }
            // 处理类似 fn(_, 2)(1) 这种情况
            else if (holesLen) {
                // fn(_, 2)(_, 3)
                if (index >= holesLen) {
                    _args.push(arg);
                }
                // fn(_, 2)(1) 用参数 1 替换占位符
                else {
                    _args.splice(_holes[index], 1, arg);
                    _holes.splice(index, 1)
                }
            }
            else {
                _args.push(arg);
            }

        }
        if (_holes.length || _args.length < length) {
            return curry.call(this, fn, _args, _holes);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}
```



### 2. 偏函数

```javascript
function partial(func, ...args) {
    return function(...args2) {
        return func.call(this, ...args, ...args2);
    }
}
```



### 3. 防抖

[防抖节流 - Codepen](https://codepen.io/flashhu/pen/jOyMQKm)

[JavaScript专题之跟着underscore学防抖](https://github.com/mqyqingfeng/Blog/issues/22)

> 事件多次触发，只有当n秒内不再触发才执行，否则重新计时
>

适用场景如：文本编辑器实时保存，防止多次提交

**整体思路**

> 重在清除定时器

* `this` 指向：使用箭头函数或闭包
* 处理传参

**基础版**

```javascript
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const self = this;
    clearTimeout(timeout);
    timeout = setTimeout(function (){
      func.apply(self, args);
    }, delay);
  };
};
```

```javascript
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
```

**进阶版**

增加立即执行，即在事件触发后就执行，直到事件停止触发 n 秒后，才会重新触发

且可返回结果（非立即执行时，异步操作，故不处理返回值）

提供取消防抖的操作

```javascript
function debounce(func, delay, immediate){
  let timeout, result, callNow = true;
  const debounce = function (...args) {
    var context = this;
    clearTimeout(timeout);
    if (immediate) {
      timeout = setTimeout(function(){
        callNow = true;
      }, delay);
      if (callNow) {
        result = func.apply(context, args);
        callNow = false;
      }
    }
    else {
      timeout = setTimeout(function(){
        func.apply(context, args)
      }, delay);
    }
    return result;
  }
  
  debounce.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  }
  
  return debounce;
};
```



### 4. 节流

[JavaScript专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)

> 一段时间内只执行一次
>

适用场景如：获取滚动条位置 scroll，拖拽，缩放

**整体思路**

> 重在控制标志位

* 时间戳：

  取当前时间和上次触发时间的间隔，再与延时时间做比较

  有头无尾，每段时间间隔的头会调用

  停止触发后不会再执行

* 定时器：

  不存在定时器则调用，调用后，设置在时间间隔后将定时器置空

  无头有尾，每段时间间隔的尾调用

  停止触发后还会有一次

**基础版**

```javascript
// 依靠时间戳 => 有头无尾
function throttle(func, delay) {
  let previous = 0;
  return function () {
    const now = Date.now();
    if (now - previous > delay) {
      func.apply(this, arguments);
      previous = now;
    }
  };
};

// 依靠定时器 => 无头有尾
function throttle(func, delay) {
  let timeout = null;
  return function(...args) {
    const self = this;
    if(!timeout) {
      timeout = setTimeout(function() {
        func.apply(self, args);
        timeout = null;
      }, delay);
    }
  }
};
```

**进阶版**

* 有头有尾

  两种基础版写法借判断条件结合起来

  首次触发时做 有头无尾操作，时间间隔内第二次触发做 无头有尾操作

* 可控头尾处理方式

  leading：false 表示禁用第一次执行
  trailing: false 表示禁用停止触发的回调

  注意及时将一些变量置 `null`，便于垃圾回收

* 可取消

```javascript
function throttle(func, delay, options) {
  let timeout
  let self
  let _args
  let previous = 0

  options = options || {}

  const later = function () {
    previous = options.leading ? Date.now() : 0
    timeout = null
    func.apply(func, _args)
    if (!timeout) self = _args = null
  }

  const throttle = function (...args) {
    const now = Date.now()
    if (previous === 0 && !options.leading) previous = now
    const remaining = delay - (now - previous)

    self = this
    _args = args

    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(self, args)
      if (!timeout) self = _agrs = null
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, remaining)
    }
  }
  
  throttle.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
    previous = 0;
  }
 
  return throttle;
};
```



#### 坑点

**在 React 的函数式组件中用防抖/节流好像没用？？**

[踩坑实例 TAT](https://github.com/flashhu/or-blog/blob/master/site/src/page/edit/index.js#L123)

[在react函数式组件中使用防抖与节流函数](https://zhuanlan.zhihu.com/p/88799841)

原因：函数组件每次渲染结束之后，内部的变量都会被释放，重新渲染时所有的变量会被**重新初始化**，产生的结果就是每一次都注册和执行了setTimeout函数。

解决办法：利用 `useRef` 或 `useCallback`



## 七、异步请求

### 1. Ajax

> 使用 Promise 封装 Ajax

* 如果没有使用 [`setRequestHeader()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/setRequestHeader) 方法设置 [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept) 头部信息，则会发送带有 `"* / *"` 的[`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept) 头部。

```javascript
const getJSON = function(url) {
    return new Promise((resolve, reject) => {
        const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Mscrosoft.XMLHttp');
        xhr.open('GET', url, false);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200 || xhr.status === 304) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.responseText));
            }
        }
        xhr.send();
    })
}
```

```javascript
const request = function(method, url, async = false, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 400) {
                reject(xhr.responseText);
            } else {
                resolve(xhr.responseText);
            }
        }
        xhr.send(body);
    })
}
```

```javascript
function ajax(options) {
    //创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest()


    //初始化参数的内容
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'
    const params = options.data

    //发送请求
    if (options.type === 'GET') {
        xhr.open('GET', options.url + '?' + params, true)
        xhr.send(null)
    } else if (options.type === 'POST') {
        xhr.open('POST', options.url, true)
        xhr.send(params)

    //接收请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let status = xhr.status
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML)
            } else {
                options.fail && options.fail(status)
            }
        }
    }
}
```



### 2. Promise

见隔壁的 [手写 Promise](handwrite/promise)



## 八、ES6 +

> 考察对 ES6+ 特性的熟悉度

[从一道前端面试题洞察面试玄机，以及编程基础的灵活应用](https://zhuanlan.zhihu.com/p/344496476)

将键值对形式的对象数组转为对象

```javascript
const processFn1 = function (data) {
    const res = {};
    for(const {key, value} of data) {
        res[key] = value
    }
    return res;
}

const processFn2 = function (data) {
    return data.reduce((res, {key, value}) => ({...res, [key]: value}), {});
}
```



## 九、结合实际

### 1. 解析 URL

[`encodeURIComponent` 和 `encodeURI` 的区别](language/JavaScript?id=_1-encodeuricomponent-和-encodeuri-的区别)

**思路**

1. 进行解码 `decodeURIComponent`
2. 取 `?` 后字符串，依据 `&` 进行分割
3. 处理键值对
   1. 带 `=`：如属性名已存在，则添加到数组中
   2. 不带 `=`：值置为 `true`

**简易实现**

```javascript
function parseQuery(url) {
    const queryArray = /.+\?(.+)$/.exec(decodeURIComponent(url))[1].split('&');
    const params = {};
    queryArray.forEach(item => {
        if(/=/.test(item)) {
            const [key, value] = item.split('=');
            if(params[key]) {
                params[key] = [].concat(params[key], value);
            } else {
                params[key] = value;
            }
        } else {
            params[item] = true;
        }
    })
    return params;
}
```



### 2. 图片懒加载 ？

[图片懒加载原理解析](https://juejin.cn/post/6844903856489365518#heading-19)

**思路**

> 目前测试的时候，得要先滑动一下，首屏的图才会显示？

1. 根据 `getBoundingClientRect` 得到元素相对视口的位置，判断是否在可见范围内
2. 在可见范围内时，将 `data-src` 中的值设到 `src` 上
3. 配合滚动监听

**模拟实现**

[codepen](https://codepen.io/flashhu/pen/KKaxQQq)

```javascript
let imgList = [...document.querySelectorAll('img')]
let len = imgList.length

const lazyLoad = (function() {
  let count = 0;
  return function() {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if(rect.top < window.innerHeight) {
        img.src = img.dataset.src;
        deleteIndexList.push(index);
        count ++;
        if(count === len) {
          document.removeEventListener('scroll', lazyLoad)
        }
      }
    })
    imgList = imgList.filter((_, index) => !deleteIndexList.includes(index));
  }
})();

document.addEventListener('scroll', lazyLoad)
```



### 3. 渲染几万条数据

**思路**

1. 使用 `createDocumentFragment` 创建文档片段，将记录先存入 `fragment`，再一次性存入目标节点，减少重排次数
2. 借助 `requestAnimationFrame` 将渲染拆分成小块

**模拟实现**

[codepen](https://codepen.io/flashhu/pen/qBRMpeY)

```javascript
setTimeout(() => {
  const total = 100000;
  const once = 20;
  const loopCount = Math.ceil(total / once);
  let countOfRender = 0;
  const container = document.getElementById('container');
  
  function add() {
    const fragment = document.createDocumentFragment();
    for(let i = 0;i < once;i ++) {
      const li = document.createElement('li');
      li.innerText = 'test' + countOfRender + '：' + i;
      fragment.appendChild(li);
    }
    container.appendChild(fragment);
    countOfRender ++;
    loop();
  }
  
  function loop() {
    if(countOfRender <= loopCount) {
      window.requestAnimationFrame(add);
    }
  }
  
  loop();
}, 0)
```



### 4. 键值对转为树状结构

递归处理

```javascript
function buildTree(input) {
    if (!input.length) return {};
    let sortedInput = input.sort((a, b) => { return a.parentId - b.parentId });
    const transfer = function (arr, index) {
        const output = {
            id: arr[index].id,
            value: arr[index].value,
            children: []
        }
        for (let i = index + 1; i < arr.length; i++) {
            if (arr[index].id === arr[i].parentId) {
                output.children.push(transfer(arr, i));
            }
        }
        return output;
    }
    return transfer(sortedInput, 0);
}
```

### 5. 模板引擎

```javascript
function render(template, data) {
    const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
    if (reg.test(template)) { // 判断模板里是否有模板字符串
        const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
        template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
        return render(template, data); // 递归的渲染并返回渲染后的结构
    }
    return template; // 如果模板没有模板字符串直接返回
}
```

