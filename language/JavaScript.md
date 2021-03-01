> 知识是有关联的 ：）

## 一、数据类型

### 1. 基础类型有哪些

> ES5：5 + 1；ES6 / ES2015：6 + 1；ES10：7 + 1

在 ES5 中，基础数据类型有 `boolean`，`null`，`undefined`，`number`，`string`
ES6 新增了 `symbol`，ES10 新增 `BigInt`



### 2. `null` 和 `undefined` 啥区别

[undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

[为什么js中要用void 0 代替undefined，还是有特别的含义呢](https://segmentfault.com/q/1010000007406985#)

首先，两个都是基础类型。区别主要在于：

* 在语义上，`null` 指已定义但值为空，`undefined` 指未赋值的自然状态，如声明未赋值的变量；

* 另一方面，`null` 为保留关键字，不能被当成标识使用，`undefined` 不是保留关键字，可能被重写，因此部分规范中要求用 `void 0` 代替 `undefined`；

> ES5之后，规定了全局变量下的`undefined`值为只读，不能改写，但局部变量中依然可以改写
>
> 非严格模式下，`undefined`是可以重写的，严格模式则不能重写

```javascript
undefined === void 0
// true
```

受历史设计原因影响：

* 在转换为数值类型时，`null` 会被转为 0，`undefined` 会转为`NaN`；

```javascript
Number(null)
// 0
Number(undefined)
// NaN
```

* 在使用`typeof`操作符时，`null` 会得到 `object`，`undefined` 会得到 `undefined`；

```javascript
typeof null
// "object"
typeof undefined
// "undefined"
```

```javascript
null == null
// true
undefined == undefined
// true
null == undefined
// true
null === undefined
// false
```



### 3. 说说 `symbol`  ？

[MDN - Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)

[ECMAScript 6 入门 - Symbol](https://es6.ruanyifeng.com/#docs/symbol)

[现代 JavaScript 教程 - Symbol](https://zh.javascript.info/symbol)

原有对象属性名只能是 `string` 类型时，容易出现**标识符冲突**，造成造成意外访问或重写；

而 `symbol` 的值是**唯一**的，可以作为对象的属性名，避免上述情况；

```javascript
Symbol() === Symbol()
// false
```

我们可以通过调用 **`Symbol()`** 函数创建，函数中可以选择传入描述，也可称为 `key`；

```javascript
var sym1 = Symbol();
var sym2 = Symbol('test');
console.log(sym1, sym2); // Symbol() Symbol(test)
```

需要注意的是，`symbol` 类型的值**不可以使用 `new`**  运算符来创建，因为 `Symbol` 函数返回的为 symbol 值，非对象，会抛出`TypeError`，提示此时非构造函数；

> 待解决疑问：`new` 调用构造函数时，如返回值不是对象但为基本类型，不是会忽略返回值吗？为何此处抛出错误？

同时，`symbol` 类型作为属性名时，该属性是**匿名，不可枚举**的。

因此，它不会在 `for...in`、`for...of` 等循环中出现，也不会通过`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回；

作为对象的属性名使用时，可以使用 **`Object.getOwnPropertySymbols`** 取到

```javascript
var obj = {
    a: 1,
    [Symbol('b')]: 2
}

for (let i in obj) {
    console.log(i); // a
}

console.log(Object.keys(obj)) // [ 'a' ]
console.log(Object.getOwnPropertyNames(obj))  // [ 'a' ]
console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol(b) ]
```

`symbol` 还提供了 `Symbol.for(key)`，`Symbol.keyFor(sym)` 方法，可用于使用同一 `symbol` 值。

 **`Symbol.for()`** 方法，根据传入值，在全局环境中先查找是否已存在，如未存在，则新建一个值；

**`Symbol.keyFor(sym)`** 方法，可以获取某一值对应的 `key` 描述

```javascript
let sym1 = Symbol.for('day')

function f(sym) {
    let sym2 = Symbol.for('day')
    return sym === sym2
}

console.log(f(sym1), Symbol.keyFor(sym1))
// true day
```



### 4. 聊聊 `BigInt` 

[tc39 - BigInt](https://tc39.es/proposal-bigint/)



### 5. 类型判断的方法

[JavaScript专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

[判断数据类型的那些坑](https://zhuanlan.zhihu.com/p/26061496)

[javascript中的类型判断](https://zhuanlan.zhihu.com/p/38249035)

[极客时间-重学前端](https://time.geekbang.org/column/article/78884)

通常，在判断自定义类时，使用`instanceof`；

其余情况使用`Object.prototype.toString` 解决。

类型判断的方式主要有四种：

**typeof**

> typeof 是一元操作符，放在其单个操作数的前面，操作数可以是任意类型。返回值为表示操作数类型的一个字符串。

注意 `typeof` 对 `null` 的返回值为 `object`，对函数的返回值为 `function`

对于`Array` 等对象子类型，返回 `object`

因此，**`typeof` 适合用于除 `null` 和对象外的类型判断**

![typeof 表格](https://static001.geekbang.org/resource/image/ec/6b/ec4299a73fb84c732efcd360fed6e16b.png)

**instanceof**

> instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。

**`instanceof` 适合用于对对象子类型进行有预期的类型判断（是不是某一类的实例）**

```javascript
console.log([1, 2] instanceof Array) // true
console.log(new Date() instanceof Date) // true
console.log(function(){} instanceof Function) // true
console.log(1 instanceof Number) // false
console.log(new Number(1) instanceof Number) // true
```

**constructor**

`constructor` 属性，会返回实例对象的原型上构造函数的引用。该属性值是函数本身。

`constructor` 可以手动修改，所以**不可靠且不稳定**，不推荐使用

如为基础数据类型，会调用它们对应的构造函数，如 `Number`。

如为 `null`，`undefined`，会抛出 `TypeError`，提示没有对应的构造函数

**`constructor` 适合用于除 `null` 和 `undefined` 外的类型判断**

```javascript
console.log((3).constructor === Number) // true
console.log(true.constructor === Boolean) // true
console.log('abc'.constructor === String) // true
console.log((new Number(3)).constructor === Number) // true
console.log((new Boolean(true)).constructor === Boolean) // true
console.log((new String('abc')).constructor === String) // true
```

**Object.prototype.toString**

`toString()` 方法返回一个表示该对象的字符串。

**`Object.prototype.toString` 适合用于内置类型的类型判断**



### 6. `null` 是不是对象

 `null` 不是对象。

> 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。     —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)

`typeof null` 得到的返回值为 `object`是由于：

`typeof` 根据类型标签判断，对象的类型标签为 `000`

而 `null` 的机器码全为0，刚好符合对象的判断规则，所以被误判为 `object`。



### 7. `typeof (function() {})` 为什么不为 `object`

[ECMA262 - The `typeof` Operator](https://tc39.es/ecma262/#sec-typeof-operator)

函数是对象的子类型，`typeof` 的返回值主要和其判断逻辑有关

根据标准可知，当对象中包含 `[[Call]]` 时，判断为 `function`，如未包含，则返回 `object`

函数包含`[[call]]` 属性，所以它是可调用的，即使是使用 `new` 运算符新建的函数也具有该属性



### 8. 类型转换

[JavaScript 深入之头疼的类型转换(上) ](https://github.com/mqyqingfeng/Blog/issues/159)

[JavaScript深入之头疼的类型转换(下)](https://github.com/mqyqingfeng/Blog/issues/164)

[极客时间-重学前端](https://time.geekbang.org/column/article/78884)

![example](https://cdn.nlark.com/yuque/0/2020/jpeg/451516/1587482732974-24a1fa63-3099-4019-b280-63406bf95fc2.jpeg)

**转为 Boolean**

如果省略或值`0`，`-0`，[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)，`false`，[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)，[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，或空字符串（`""`），该对象具有的初始值`false`。

其他均为 `true`，易混淆的如`{}`，`[]`，`"false"`

```javascript
console.log(Boolean()) // false
console.log(Boolean(0)) // false
console.log(Boolean(-0)) // false
console.log(Boolean(NaN)) // false
console.log(Boolean(null)) // false
console.log(Boolean(undefined)) // false
console.log(Boolean("")) // false
console.log(Boolean(false)) // false
console.log(Boolean([])) // true
console.log(Boolean({})) // true
console.log(Boolean("false")) // true
```

**转为 Number**

`null` 会转为 0， `undefined` 会转为 NaN

字符串转换时，首先会忽略前导空格及前导0，尝试转换为整数或浮点数，如确定非数字，则结果为 NaN

`symbol` 类型不能转换为数字，会抛出`TypeError`，提示不能进行转换

```javascript
console.log(Number()) // +0
console.log(Number(null)) // +0
console.log(Number(undefined)) // NaN
console.log(Number(true)) // 1
console.log(Number(false)) // +0
console.log(Number("0")) // +0
console.log(Number("-123")) // -123
console.log(Number("1.2")) // 1.2
console.log(Number("000123")) // 123
console.log(Number("   123")) // 123
console.log(Number("0x11")) // 17
console.log(Number("0o11")) // 9
console.log(Number("0b11")) // 3
console.log(Number("")) // +0
console.log(Number(" ")) // +0
console.log(Number("123 123")) // NaN
console.log(Number("foo")) // NaN
```

**转为字符**

`null`，`undefined` 值转换后，转为类型名称的字符串形式

布尔类型转换为对应的`"false"`，`"true"`

数字转字符较复杂，常见项基本为转换成数字字符串

`symbol` 类型不能转换为字符，会抛出`TypeError`，提示不能进行转换

```javascript
console.log(String()) // 
console.log(String(null)) // null
console.log(String(undefined)) // undefined
console.log(String(false)) // false
console.log(String(true)) // true
console.log(String(0)) // 0
console.log(String(-0)) // 0
console.log(String(NaN)) // NaN
console.log(String(Infinity)) // Infinity
console.log(String(-Infinity)) // -Infinity
console.log(String(1)) // 1
```

**转为 object**

>  装箱操作，把基本类型转换为对应的对象

`null`，`undefined` 类型不能转换为字符，会抛出`TypeError`

原始值调用 String()、Number() 或者 Boolean() 构造函数即可

`symbol` 类型的转换可以通过 `call` 方法来强迫产生装箱，或使用内置的 `Object` 函数显式调用

```javascript
var symObj1 = (function () { return this; }).call(Symbol("a"))
var symObj2 = Object(Symbol('a'))
console.log(symObj1, symObj2) 
// [Symbol: Symbol(a)] [Symbol: Symbol(a)]
```

**object 转为各类值**

> 拆箱操作，把对象转换为对应的基本类型

所有对象转为布尔类型，均为 `true`





## 二、作用域

### 1. let, var 区别

首先，从作用域角度看，`var` 声明的变量可以使用在**全局作用域以及函数作用域**中，而 `let` 声明的变量是限制在**块级作用域**中的。所以，在最程序顶部声明时，`var` 会**向全局对象添加属性**，`let` 不会。

其次，`var` 会进行**变量提升**处理，因此将声明放在其所在作用域的任一行都可以，在被赋值前返回值为 `undefined`，但 `let` 不会，在声明前是不可访问的。受 `let` 这一特点的影响，在执行到 `let` 初始化语句前，存在**暂存死区**，如果使用该变量会抛出 `ReferenceError`，提示不能在初始化前取到该变量。

最后，`var` 在同个作用域内可**重复声明**，后面的值会覆盖前面的值，但 `let` 在同个作用域内如重复声明，会抛出语法错误，提示不要重复声明。这个在写 `switch` 语句时会碰到，因为 ``switch``语句为一个块作用域。



### 2. 何为提升

这里我认为可以分为广义和狭义理解

广义上讲，提升，指的是所有声明都会被移动到所在作用域的顶部。

这是因为 JavaScript 引擎在执行代码前会进行编译，在这过程中将声明的变量关联其所在作用域，而赋值及其他逻辑会等到运行时进行。

狭义上，指的是 `var` 所具有的变量提升的特点。

这是因为在处理`var` 声明时，除绑定作用域外，还进行了初始化，设为 `undefined`。而`let`，`const`  没有初始化，所以没有变量提升。

在这部分还需要注意的是，函数表达式的表现和变量声明相似，只会提升声明本身，不提升赋值，但函数声明会全部提升，包含函数体。



### 3. 为什么需要块级作用域

[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/let#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%9F)

主要是因为，原有全局作用域和函数作用域的设计会带来一些使用上的问题。

在循环语句中，使用 `var` 声明的计数变量在循环外也可以使用，变量**污染外部函数作用域**。

同时，`var` 变量提升，可重复声明的特点可能导致**内部变量覆盖外部变量**，引发意料外的错误。

```javascript
var tmp = 1;

function f() {
    console.log(tmp);
    if (false) {
        var tmp = 'test';
    }
}

f(); // undefined
```

此时主要的问题在于可维护性。

如果**涉及异步代码**，就会未取到当次循环数据的情况。因为当处理回调函数时，变量取所在函数作用域中的值，此时为循环结束的数值。比如循环 0 到 3，最后输出 3 次 3。如使用块作用域，变量会使用块级作用域中的值，因此还是按序输出。

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 0);
}
// 3 3 3
```

```javascript
for (let i = 0; i < 3; j++) {
    setTimeout(function() {
        console.log(i);
    }, 0);
}
// 0 1 2
```



### 4. ES6 前如何使用块级作用域

[MDN - with](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)

**第一种**，可以使用 `with`。

`with` 将一个对象添加到作用域链顶部，处理为一个被隔离的词法作用域。

其括号中语句的赋值操作，会对属性进行 LHS查询。

在非严格模式下，当整个作用域链中都不存在该变量时，会在全局作用域中创建该变量，并进行赋值。

ES5 严格模式下已被禁用，会抛出语法错误。

它是一种欺骗词法作用域的方式。

**第二种**，是使用 `try/catch` 语句，其中 `catch` 分句会创建一块作用域 。

Babel 处理这部分转换是比较灵活的，如：

* 处理循环中带异步时，除 `let` 声明变为 `var` 外，将相关异步操作变为一函数，控制在新的函数作用域内
* 在重复声明方面，`let` 处理为 `var` 时，如变更会引起重复声明，则修改一方的变量名

```javascript
// with - 传入对象中有对应属性
var o1 = {
    a: 1
}

function f(obj) {
    with(obj) {
        a = 2
    }
}

f(o1)
console.log(o1.a) // 2
```

```javascript
// with - 传入无对应属性
var n1 = 1

function f(obj) {
    with(obj) {
        a = 2
    }
}

f(n1)
console.log(n1, a) // 1 2
```

```javascript
// with - LHS查询，延作用域链查找
var o1 = {
    a: 1
}

function f(obj) {
    var b = 2
    with(obj) {
        b = 3
    }
    console.log(b)
}

f(o1)
console.log(o1.a) // 3 1
```

```javascript
// ES6
let a = 2;
console.log(a);
{
	let a = 1;
  console.log(a);
}

// Babel处理后
var a = 2;
console.log(a);
{
  var _a = 1;
  console.log(_a);
}

```

```javascript
// ES6 代码见前一问示例

// Babel处理后
var _loop = function _loop(i) {
  setTimeout(function () {
    console.log(i);
  }, 0);
};

for (var i = 0; i < 3; j++) {
  _loop(i);
}
```



### 模块化演变





## 三、闭包

## 四、垃圾回收

## 五、this

> **在一个方法调用中，`this` 始终是点符号 `.` 前面的对象**

### 1. new 原理

[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)

[用new实例化一个对象时，this指针的绑定--读《JavaScript语言精粹》P47疑惑](https://segmentfault.com/q/1010000007373629/a-1020000007373771#)

`new` 运算符将调用构造函数，返回对应对象类型的实例，并会将 `this` 绑定到新对象上；

构造函数可以是内置对象提供的函数，或自定义的函数，通常自义定类型的构造函数会首字母大写。

首先，它会创建一新对象；

接着，将对象与构造函数的原型 `prototype` 建立连接；

并且，改变函数 this 指向为新建对象；

最后返回对象。

如返回值为非对象类型的基本类型，那么会忽略这个返回值。

```javascript
function Test(params) {
    this.x = 1;
    return params;
}

var a = 2
var tmp = new Test({ a: 1 })
console.log(new Test('abc')) // Test  { x: 1 }
console.log(tmp.a) // 1
```

[模拟 new 实现](handwrite/JavaScript-hw.md?id=_1-如何模拟-new)



## 六、对象

1. Object

   `Object.assign(target, ...sources)`

   `Object.getPrototypeOf()`

   `Object.getOwnPropertyDescriptors()`
   
   - [Object.keys(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) / [Object.values(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/values) / [Object.entries(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) —— 返回一个可枚举的由自身的字符串属性名/值/键值对组成的数组。
   - [Object.getOwnPropertySymbols(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) —— 返回一个由自身所有的 symbol 类型的键组成的数组。
- [Object.getOwnPropertyNames(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) —— 返回一个由自身所有的字符串键组成的数组。
   - [obj.hasOwnProperty(key)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)：如果 `obj` 拥有名为 `key` 的自身的属性（非继承而来的），则返回 `true`。




### `new`  和 `Object.create()` 的区别

**`Object.create()`**方法创建一个新对象，使用现有的对象来提供新创建的对象的_\_proto__

```javascript
function Fruit() {
    this.type = 'fruit'
}

function Apple() {
    this.name = 'apple'
}

// Apple.prototype = new Fruit()
Apple.prototype = Object.create(Fruit.prototype);

var a = new Apple()
console.log(a instanceof Apple) // true
console.log(a instanceof Fruit) // true 
```





## 七、继承

## 八、原型

> “JavaScript中的机制有一个核心区别，那就是不会进行复制，对象之间是通过内部的[[Prototype]]链关联的。”          ——《你不知道的 JavaScript》

### 1. `prototype` ， `__proto__` ，`[[Prototype]]`区分

[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)

[现代 JavaScript 教程 - 原型继承](https://zh.javascript.info/prototype-inheritance)

每个函数都有一个 `prototype` 属性，指向该构造函数将会创建的实例的原型，它的值为某一对象或 `null`；

每一对象都有一个**隐藏**属性 `[[Prototype]]`，它的值为某一对象或 `null`；

在函数被 `new` 运算符作为构造函数调用时，函数的 `prototype` 属性为新实例对象的 `[[Prototype]]` 赋值；

`__proto__` 是 `[[Prototype]]` 的 getter/setter，是一种访问方式；

`__proto__`  是受[历史原因](https://zh.javascript.info/prototype-methods#yuan-xing-jian-shi)影响的遗留物，实际使用过程中，更应选择使用`Object.getPrototypeOf` (ES6) 或 `Object.setPrototypeOf`  (ES6) 来 get/set 原型

![prototype](../image/language/js-prototype.png)

```javascript
function User() { }
const user = new User()
console.log(User.prototype === user.__proto__) // true
console.log(Object.getPrototypeOf(user) === User.prototype) // true
console.log(User.prototype.constructor === User) // true
```



### 2. `constructor` 属性

[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)

[现代 JavaScript 教程 - F.prototype](https://zh.javascript.info/function-prototype)

默认提供的 `prototype` 具有 `constructor` 属性，指向关联的构造函数。

但需要注意的是，如果我们将 ``prototype`` 完全替换，会不再具有 ``constructor`` 属性。



### 3. `__proto__` 的替代项

- [Object.create(proto, [descriptors])](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/create) —— 利用给定的 `proto` 作为 `[[Prototype]]` 和可选的属性描述来创建一个空对象。
- [Object.getPrototypeOf(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) —— 返回对象 `obj` 的 `[[Prototype]]`。
- [Object.setPrototypeOf(obj, proto)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) —— 将对象 `obj` 的 `[[Prototype]]` 设置为 `proto`。



### 4. `prototype` 与 `constructor` 取值上的区别

`prototype` 的取值为构造函数的一个实例，如仅设为函数本身，会影响 `instanceof` 结果

`constructor` 的取值为构造函数本身

```javascript
function Test() {
    this.a = 1
}

var t = new Test()

console.log(t, Test)
// Test { a: 1 } [Function: Test]
console.log(t.__proto__, Test.prototype)
// Test {} Test {}
console.log(t.__proto__.constructor, Test.prototype.constructor)
// [Function: Test] [Function: Test]
```



### 5. `isPrototyoeOf` 和 `instanceof` 的区别

> `object instanceof constructor`                —— [MDN - instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
>
> `prototypeObj.isPrototypeOf(object)`      —— [MDN - isPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/object/isPrototypeOf)

从定义上看，**`isPrototyoeOf`** 是检查原型**对象**是否存在与实例**对象**的原型链上；**`instanceof`** 检查**构造函数**的 `prototype` 属性指向的原型对象是否在实例**对象**的原型链上

总的来说，`isPrototyoeOf` 判断是否**继承**自某对象，`instanceof` 判断是否是某构造函数的**实例**

```javascript
function Apple() {
    this.name = 'apple'
}

var a = new Apple()
console.log(a instanceof Apple) // true
console.log(Apple.prototype.isPrototypeOf(a)) // true
```



## 九、函数

### 1. 函数柯里化



## 十、追新

### 1. 常用的 ES6 特性

[ES6 标准](https://262.ecma-international.org/6.0/)



### 2. 最近的新特性



## 十一、一些定义

### 1. 为什么是解释型语言

[JavaScript到底是解释型语言还是编译型语言?](https://mp.weixin.qq.com/s/neqAVDUqHA4_qoswk-VWHw)

> **JavaScript (** **JS** ) 是一种解释型或即时编译型的编程语言 - MDN

解释型语言指在运行时将程序转化为机器语言



### 2. 什么是执行上下文

[JavaScript深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)

[JavaScript深入之执行上下文](https://github.com/mqyqingfeng/Blog/issues/8)

执行上下文（execution context），是对 JavaScript 代码执行环境的抽象。

它包含变量对象（Variable object，VO），作用域链，this 等。

当执行一段代码时，即会创建对应的执行上下文。

* 变量对象就是执行环境中包含了所有变量和函数的对象
* 活动对象是函数执行的时候被创建的对象









