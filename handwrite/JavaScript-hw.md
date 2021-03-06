> 手写的核心是理解，别背！

## 一、对象

### 1. 如何模拟 `new`

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
    // var ret = Constructor.apply(obj, arguments);
    // 4. 如构造函数返回结果为对象，则直接返回，否则返回新建对象，忽略返回值
    // return typeof ret === 'object' ? ret : obj;
    return obj;
}
```

### 2. 如何模拟`instanceof`

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

### 3. 如何模拟 `Object.create`

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

