> 手写的核心是理解，别背！

## 一、对象

### 1. 如何模拟 `new`

[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)

```javascript
function myNew() {
    // 1. 新建对象
    var obj = new Object();
    // 2. 连接原型链
    // 2.1 取得构造函数
    var Constructor = [].shift.call(arguments);
    // 2.2 为新建对象的 [[prototype]] 赋值  (ES6)
    Object.setPrototypeOf(obj, Constructor.prototype);
    // 3. 调用构造函数，并改变 this 指向
    var ret = Constructor.apply(obj, arguments);
    // 4. 如构造函数返回结果为对象，则直接返回，否则返回新建对象，忽略返回值
    return typeof ret === 'object' ? ret : obj;
}
```

