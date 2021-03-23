> 手写的核心是理解，别背！

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
    // 4. 如构造函数返回结果为对象，则直接返回，否则返回新建对象，忽略返回值
    return typeof ret === 'object' ? ret : obj;
}
```



### 2. instanceof`

[instanceOf原理，手写一个instanceOf?(快手）](https://github.com/qappleh/Interview/issues/170)

[(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.cn/post/6844903974378668039#heading-15)

```javascript
// left 表示左表达式，right 表示右表达式
function myInstanceOf(left, right) {
    // 1. 如为基础类型，直接返回 false
    if(typeof(left) !== 'object' || left === null) {
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

## 二、this

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
    var fn = 'fn' + new Date().valueOf();
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
    var fn = 'fn' + new Date().valueOf();
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



## 三、深浅拷贝

### 1. 浅拷贝

[JavaScript专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)

[详解forin，Object.keys和Object.getOwnPropertyNames的区别](https://yanhaijing.com/javascript/2015/05/09/diff-between-keys-getOwnPropertyNames-forin/)

本质：遍历对象属性

数组 => 利用数组的一些方法比如：`slice`、`concat` 返回一个新数组的特性来实现拷贝

```javascript
var new_arr = arr.concat();
var new_arr = arr.slice();
```

```javascript
var shallowCopy = function(obj) {
    // 0. 检查类型：只拷贝对象
    if (typeof obj !== 'object') return;
    // 1. 根据 obj 的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
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

[【进阶4-3期】面试题之如何实现一个深拷贝 ](https://github.com/yygmind/blog/issues/29)

[【进阶4-4期】Lodash是如何实现深拷贝的](https://github.com/yygmind/blog/issues/31)

[JavaScript专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)

[深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

#### JSON

> 为了简单起见， 我们来看看什么是 不安全的 JSON 值 。 undefined 、 function 、 symbol （ES6+）和包含循环引用（对象之间相互引用，形成一个无限循环）的 对象 都不符合 JSON 结构标准，支持 JSON 的语言无法处理它们。

优点是讨巧，简单；缺点为不支持拷贝函数，会丢失数据间的引用关系，使用的其实还是递归

```javascript
var new_data = JSON.parse(JSON.stringify(data));
```

#### 正经版

需要解决的问题：

* 循环引用 = `问题` => “你的朋友还是你”，层级加深 = `解决方式` => 循环检测 / 暴力破解
* 使用递归 = `问题` => 层级过深容易爆栈 = `解决方式` => 循环（树的 dfs / bfs）
* 使用深拷贝的对象挺多的：数组，对象，`Map`...

```

```



## 四、异步

[9k字 | Promise/async/Generator实现原理解析](https://juejin.cn/post/6844904096525189128)

### 1.  `Promise`



### 2. `async / await`



### 3. `Generator`

