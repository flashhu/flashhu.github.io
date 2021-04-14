> 
>
> 知识是有关联的 ：）

> 《你不知道的 JS》
>
> 《JavaScript 高级程序设计》
>
> 《现代 JavaScript 教程》

[ES2021](https://tc39.es/ecma262/2021/)



JavaScript 是（解释型语言，动态语言，弱类型语言）。

* 解释型语言指在运行时将程序转化为机器语言
* 动态语言指在运行过程中需要检查数据类型的语言
* 弱类型语言指支持隐式类型转换的语言



## 一、数据类型

### 1. 基础类型有哪些

> 或者称为 原始类型

> ES5：5 + 1；ES6 / ES2015：6 + 1；ES11 / 2020：7 + 1

* 在 ES5 中，基础数据类型有 `boolean`，`null`，`undefined`，`number`，`string`
* ES6 新增了 `symbol`
* ES10 新增 `BigInt`



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



### 3. `0.1 + 0.2 !== 0.3` 为什么

[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)

[(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.cn/post/6844903974378668039#heading-5)

[JavaScript 深入之浮点数精度](https://github.com/mqyqingfeng/Blog/issues/155)

> 0.1和0.2在转换成二进制后会无限循环，
>
> 由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，
>
> 相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。

浮点数运算的精度问题导致等式左右的结果并不是严格相等，而是相差了个微小的值

```javascript
console.log(0.1 + 0.2 == 0.3); // false
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON); // true
```

**浮点数进度问题**

JS 采用双精确度，用 64 位字节来储存一个浮点数

0.1 转成二进制时是一个无限循环的数， 0.00011001100110011……

在存储时就已经发生精度丢失

`0.1 + 0.2` 实际发生了三次精度丢失，两次存储，一次运算



### 4. `string` 类型的长度

[【JS迷你书】String类型与UTF-16](https://juejin.cn/post/6844903841817690119)

首先，`string` 类型指的是字符串的 UTF16 编码。

我们常用的如 `length` 方法等都是针对 UTF16 编码的，把每个`UTF16`单元当作是一个字符来处理。

因此，字符串的最大长度实际受字符串的编码长度影响，通常说最大长度为 2^53 - 1。



### 5. 说说 `symbol`  

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

 **`Symbol.for()`** 方法，根据传入值，在**全局环境**中先查找是否已存在，如未存在，则新建一个值；

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



### 6. 聊聊 `BigInt` 

[tc39 - BigInt](https://tc39.es/proposal-bigint/)

[MDN - 数字类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E6%95%B0%E5%AD%97%E7%B1%BB%E5%9E%8B)

[caniuse - BigInt](https://www.caniuse.com/mdn-javascript_builtins_bigint_asintn)    大部分均支持

原先 `number` 类型是双精度 64 位二进制格式的值，只能安全地表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），任何超出此范围的整数值都可能**丢失精度**，并无法保证**安全性**。

而 `BigInt` 允许我们安全地存储和操作大整数，通过在整数末尾附加 `n `或调用构造函数就可以创建 `BigInt`。

注意，使用构造函数创建时，如直接传递数字，有可能出现精度的损失，需要**传递数字字符串**；和 `Symbol` 相似，**不可以使用 `new`**  运算符来创建

```javascript
console.log(9999999999999999999999999998)  // 1e+28
console.log(9999999999999999999999999998n) // 9999999999999999999999999998n
console.log(BigInt('9999999999999999999999999998')) // 9999999999999999999999999998n
console.log(BigInt(9999999999999999999999999998)) // 9999999999999999583119736832n
```

同时，`BigInt` 类型**不能与 `number` 类型混用**，会抛出 `TypeError`，提示不要混用；同理，`BigInt` 类型的数字不能直接传入需要 `number` 类型的函数，如`Math.max`；如有需要，需要进行显示转换。

而且，`BigInt` 不支持使用一元加法运算法转换为 `number` 类型



### 7. 类型判断的方法 

[JavaScript专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

[判断数据类型的那些坑](https://zhuanlan.zhihu.com/p/26061496)

[javascript中的类型判断](https://zhuanlan.zhihu.com/p/38249035)

[极客时间-重学前端](https://time.geekbang.org/column/article/78884)

#### 总结

`null`，`undefined` 直接使用严格相等 `===` 判断

非 `null`，`undefined` 的基本类型及函数使用 `typeof` 判断

剩余内置类型使用 `Object.prototype.toString` 判断

自定义类型使用`instanceof`



#### typeof

> typeof 是一元操作符，放在其单个操作数的前面，操作数可以是任意类型。返回值为表示操作数类型的一个字符串。

注意 `typeof` 对 **`null`** 的返回值为 `object`，对**函数**的返回值为 `function`

对于`Array` 等对象子类型，返回 `object`

因此，**`typeof` 适合用于除 `null` 和对象外的类型判断**

![typeof 表格](https://static001.geekbang.org/resource/image/ec/6b/ec4299a73fb84c732efcd360fed6e16b.png)

#### instanceof

> instanceof 运算符用来测试一个对象在其**原型链**中是否存在一个构造函数的 prototype 属性。

```
obj.__proto__.__proto__ ... = Obj.prototype
```

**`instanceof` 适合用于对非 `Function`，`Object`的引用类型进行类型判断（是不是某一类的实例）**

还可以使用 [`Symbol.hasInstance`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)，自定义`instanceof`在某一类上的行为

```javascript
console.log([1, 2] instanceof Array) // true
console.log(new Date() instanceof Date) // true
console.log(1 instanceof Number) // false
console.log(Symbol() instanceof Symbol) // false
console.log(BigInt('111') instanceof BigInt) // false
console.log(new Number(1) instanceof Number) // true
```

```javascript
// 一些特殊的例子
console.log( Function instanceof Function ); // true
console.log( Function instanceof Object ); // true
console.log( Object instanceof Function ); // true
console.log( Object instanceof Object ); // true
```

[原型链图例](language/JavaScript?id=_7-原型链)

```javascript
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true
```

[模拟 instanceof 实现](handwrite/JavaScript-hw.md?id=_2-如何模拟instanceof)

**缺点**

instanceof操作符的问题在于，它假定只有一个全局环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的Array构造函数。
 如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

#### constructor

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

#### Object.prototype.toString

[MDN - Object.prototype.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

使用 `Object.prototype.toString` 是因为，其他类可能根据使用需要改写了 `toString` 方法

`toString()` 方法返回一个表示该对象的字符串，步骤主要有：

1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 令 O 为以 this 作为参数调用 ToObject 的结果（转化为对象）
4. 令 class 为 O 的 [[Class]] 内部属性的值
5. 返回三个字符串 "[object ", class, and "]" 连起来的字符串

```javascript
function Test() {}

var t = new Test()

console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
console.log(Object.prototype.toString.call(null)) // [object Null]
console.log(Object.prototype.toString.call([])) // [object Array]
console.log(Object.prototype.toString.call(Test)) // [object Function]
console.log(Object.prototype.toString.call(t)) // [object Object]
```

在 IE6 / Edge 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

> 实际测试时，Edge 可正常返回，IE 返回 [object Window]

**`Object.prototype.toString` 适合用于内置类型的类型判断**



#### 其他特定方法

* `Array.isArray`

  ```javascript
  Array.isArray([1, 2, 3]);  // true
  Array.isArray({foo: 123}); // false
  Array.isArray('foobar');   // false
  Array.isArray(undefined);  // false
  ```

* `isNaN` 或 `Number.isNaN`

  ```javascript
  isNaN(NaN);       // true
  isNaN(undefined); // true
  isNaN({});        // true
  
  isNaN(true);      // false
  isNaN(null);      // false
  isNaN(37);        // false
  
  isNaN("37,5");    // true
  isNaN('123ABC');  // true:  parseInt("123ABC") is 123 but Number("123ABC") is NaN
  isNaN(new Date().toString());     // true
  isNaN('blabla');   // true: "blabla" is converted to a number.
  ```

  

### 8. `null` 是不是对象

 `null` 不是对象。

> 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。     —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)

`typeof null` 得到的返回值为 `object`是由于：

`typeof` 根据类型标签判断，对象的类型标签为 `000`

而 `null` 的机器码全为0，刚好符合对象的判断规则，所以被误判为 `object`。



### 9. `typeof (function() {})` 为什么不为 `object`

[ECMA262 - The `typeof` Operator](https://tc39.es/ecma262/#sec-typeof-operator)

函数是对象的子类型，`typeof` 的返回值主要和其判断逻辑有关

根据标准可知，当对象中包含 `[[Call]]` 时，判断为 `function`，如未包含，则返回 `object`

函数包含`[[call]]` 属性，所以它是可调用的，即使是使用 `new` 运算符新建的函数也具有该属性



### 10. 显式类型转换

[JavaScript 深入之头疼的类型转换(上) ](https://github.com/mqyqingfeng/Blog/issues/159)

[极客时间-重学前端](https://time.geekbang.org/column/article/78884)

![example](../image/language/type-conversion.jpeg)

#### 转为 Boolean

> **有一些 [“falsy” 值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，如数字 `0`，仍然会被 React 渲染**

如果省略或值`0`，`-0`，`0n`， [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)，`false`，[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)，[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，或空字符串（`""`），该对象具有的初始值`false`。

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

#### 转为 Number

> ToNumber

`null` 会转为 0， `undefined` 会转为 NaN

字符串转换时，首先会忽略前导空格及前导0，尝试转换为整数或浮点数，如确定非数字，则结果为 NaN

`symbol` 类型不能转换为数字，会抛出`TypeError`，提示不能进行转换

`BigInt` 类型如数值太大，转换后会损失精度

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
console.log(Number(Number(101351135999999999999991n))) // 101351135999999999999991n
```

#### 转为字符

> ToString

`null`，`undefined` 值转换后，转为类型名称的字符串形式

布尔类型转换为对应的`"false"`，`"true"`

数字转字符较复杂，常见项基本为转换成数字字符串

`symbol` 类型不能转换为字符，会抛出`TypeError`，提示不能进行转换

`BigInt` 类型转换后为去后缀 `n` 的数字字符串

```javascript
console.log(String()) // ""
console.log(String(null)) // "null"
console.log(String(undefined)) // "undefined"
console.log(String(false)) // "false"
console.log(String(true)) // "true"
console.log(String(0)) // "0"
console.log(String(-0)) // “0”
console.log(String(NaN)) // “NaN”
console.log(String(Infinity)) // “Infinity"
console.log(String(-Infinity)) // "-Infinity"
console.log(String(1)) // "1"
console.log(String(0n)) // "0"
console.log(String(101351135999999999999999991n)) // "101351135999999999999999991"
```

#### 转为 object

>  装箱操作，把基本类型转换为对应的对象

`null`，`undefined` 类型不能转换为字符，会抛出`TypeError`

原始值调用 String()、Number() 或者 Boolean() 构造函数即可

`symbol` 类型的转换可以通过 `call` 方法来强迫产生装箱，或使用内置的 `Object` 函数显式调用

`BigInt` 类型的装箱操作与 `symbol` 相似

```javascript
var symObj1 = (function () { return this; }).call(Symbol("a"))
var symObj2 = Object(Symbol('a'))
console.log(symObj1, symObj2) 
// [Symbol: Symbol(a)] [Symbol: Symbol(a)]

var bIntObj1 = (function () { return this; }).call(BigInt("1111111"))
var bIntObj2 = Object(BigInt("1111111"))
console.log(bIntObj1, bIntObj2) 
// [BigInt: 1111111n] [BigInt: 1111111n]
```

#### object 转为各类值

> 拆箱操作，把对象转换为对应的基本类型

> 所有的对象除了 null 和 undefined 之外的任何值都具有 `toString` 方法

> 内部相关的方法为 ToPrimitive  [ES5 9.8](http://es5.github.io/#x9.8)

* 所有对象转为布尔类型，均为 `true`

* 转字符串，使用 [`toString` ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)。

  默认返回由 "[object " 和 class 和 "]" 三个部分组成的字符串，但不同类型存在改写方法的情况，如：

  * 数组的 toString 方法将每个数组元素转换成一个字符串，并在元素之间添加逗号后合并成结果字符串。
  * 函数的 toString 方法返回源代码字符串。
  * 日期的 toString 方法返回一个可读的日期和时间字符串。
  * RegExp 的 toString 方法返回一个表示正则表达式直接量的字符串。

  先 `toString`, 再 `valueOf`，转为原始值，再转为字符串（参考数字转字符串）

* 转数字，使用 [`valueOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

  默认返回对象本身，数组、函数、正则、布尔、数字、字符串也会返回本身。

  日期是一个例外，它会返回从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC

  先`valueOf` , 再 `toString`，转为原始值，再转为数字（参考字符串转数字）

```javascript
console.log(Number({})) // NaN
console.log(Number({ a: 1 })) // NaN
console.log(Number([])) // 0
console.log(Number([0])) // 0
console.log(Number([1, 2, 3])) // NaN
console.log(Number(function () { var a = 1; })) // NaN
console.log(Number(/\d+/g)) // NaN
console.log(Number(new Date(2010, 0, 1))) // 1262275200000
console.log(Number(new Error('a'))) // NaN
console.log(Number(Number(Object(BigInt(99999999999999999999999)))) // 1e+23
console.log(Number(String(Object(BigInt(99999999999999999999999)))) // "99999999999999991611392"
```



### 11. '1'.toString()为什么可以调用？

> 引用类型与基本包装类型的主要区别就是对象的生存期。
>
> 自动创建的基本包装类型的对象，只存在于一行代码的执行瞬间，然后立即被销毁。
>
> —— 《JavaScript高级程序设计（第三版）》

首先，每读取一个基本类型值时，后台会**创建一个与它对应的基本包装类型的对象**，因此我们可以调用一些方法来处理数据，如此处的`'1'.toString()`，或更常见的 `'abc'.length`

这一语句包含的处理有：

```javascript
// 1. 创建 String 类型实例
var s1 = new String("1");
// 2. 调用指定方法
var s2 = s1.toString();
// 3. 销毁实例
s1 = null;
```



### 12. 为什么 `1.toString()` 抛出语法错误

[Why can't I access a property of an integer with a single dot?](https://stackoverflow.com/questions/9380077/why-cant-i-access-a-property-of-an-integer-with-a-single-dot)

因为此时代码被理解为 `(1.)toString()`，`.` 被视为数字的一部分

为避免将点号解释为小数点，可改写为：

```javascript
(1).toString(); // 2 is evaluated first
1..toString(); // the second point is correctly recognized
1 .toString(); // note the space left to the dot
```



### 13. 隐式类型转换

[JavaScript深入之头疼的类型转换(下)](https://github.com/mqyqingfeng/Blog/issues/164)

#### 一元操作符 +

 [ES5规范1.4.6](http://es5.github.io/#x11.4.6)

类似于对象转数字的过程，先转为原始值，再字符串转数字：

1. 如果 `obj` 为基本类型，直接返回
2. 否则，调用 `valueOf` 方法，如果返回一个原始值，则 `JavaScript` 将其返回。
3. 否则，调用 `toString` 方法，如果返回一个原始值，则`JavaScript` 将其返回。
4. 否则，`JavaScript` 抛出一个类型错误异常。

```javascript
console.log(+['1']); // 1
console.log(+['1', '2', '3']); // NaN
console.log(+{}); // NaN
```

#### 二元操作符 +

[ES5规范11.6.1](http://es5.github.io/#x11.6.1)

> ToPrimitive：当不传入 PreferredType 时，如果 input 是日期类型，相当于传入 String，否则，都相当于传入 Number。如果传入的 input 是 Undefined、Null、Boolean、Number、String 类型，即传入 ES5 时的基础类型，直接返回该值。

当计算 value1 + value2时：

1. lprim = ToPrimitive(value1)
2. rprim = ToPrimitive(value2)
3. 如果 lprim 是字符串或者 rprim 是字符串，那么返回 ToString(lprim) 和 ToString(rprim)的拼接结果
4. 返回 ToNumber(lprim) 和 ToNumber(rprim)的运算结果

```javascript
console.log(null + 1); // 1
console.log([] + []); // ''
console.log([] + {}); // '[object Object]'
console.log({} + []); // '[object Object]'
console.log(1 + true); // 2
console.log({} + {}); // '[object Object][object Object]'
console.log(new Date(2017, 04, 21) + 1) // "Sun May 21 2017 00:00:00 GMT+0800 (CST)1"
```



### 14. `==` 与 `===` 的区别

[JavaScript深入之头疼的类型转换(下)](https://github.com/mqyqingfeng/Blog/issues/164)

`===` 进行严格比较，只要类型不匹配或值不相等，就返回`flase`

`==` 在比较的时候可以转换数据类型，具体步骤为：

* 如类型相同时，当两数值相同，则返回`true`

  * 注意部分特殊情况，如 NaN 与任何值不等（包含自身），`+0` 与 `-0` 此时不区分作为相同值处理

* 如类型不同，需要进行类型转换

  * 比较包含布尔值，将布尔类型转为数字 `ToNumber`
  * 一边是字符串或数字或`symbol`，另一边为对象类型，则将对象类型转换为原始类型 `ToPrimitive`

  * 数字和字符串比较，则转换字符串类型为数字类型 `ToNumber`

  * `null` 和 `undefined` 比较，返回 `true`
  * 非上述情况，返回 `false`

```javascript
console.log(false == "0")
console.log(false == 0)
console.log(false == "")
console.log("" == 0)
console.log("" == [])
console.log([] == 0)
console.log("" == [null])
console.log(0 == "\n")
console.log([] == 0)
// 1. 右边为 false 2. 右边转为 0 3.左边转为 '' 4. 左边转为 0
console.log([] == ![]) 
// null == 0 不符合上述规则，返回 false
console.log(null != 0) 
// 全为 true
```



### 15. 引用类型有哪些

[标准内置对象分类 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#%E6%A0%87%E5%87%86%E5%86%85%E7%BD%AE%E5%AF%B9%E8%B1%A1%E5%88%86%E7%B1%BB)

* String

* Number

* Boolean

* Object

* Function

* Array

  删改数组，肯定会变原数组（push，unshift，pop，shift）

  排序，也会变原数组（sort，reverse）

  带 p 改原数组，没带为浅拷贝（splice）

  `Array.prototype.slice([begin[, end]])` **浅拷贝**了原数组中元素的一新数组

  `Array.prototype.splice(start[, deleteCount[, item1[, item2[, ...]]]])` 删除/替换/添加元素
  
  `concat` 也为**浅拷贝**

![数组操作](../image/language/array-method.png)

* Date
* RegExp
* Error



### 16. 基本数据类型和复杂数据类型存储上的区别

[栈空间和堆空间：数据是如何存储的？](https://time.geekbang.org/column/article/129596)

> 即，原始值、引用值的区别

* 在 JavaScript 的执行过程中， 主要有三种类型内存空间，分别是代码空间（存储可执行代码的）、栈空间和堆空间

* 基本数据类型值占据固定大小，保存在**栈**中。

  复杂 (引用) 数据类型的值是对象，在**栈**中存入的是引用地址，该地址指向**堆**内存，在堆内存存入的是具体值。

* 基本数据类型是**值拷贝**，拷贝的是具体值；复杂数据类型是**引用拷贝**，拷贝的指向堆内存的引用地址。因此，我们将对象赋值给新的变量时，如使用新变量对属性进行修改，会影响原有变量指向的值，因为两个变量指向同一块内存空间

* 常见例子还有为二维数组初始化时，如使用下方示例代码创建，会导致在修改某行时，所有行均改变，因为此时存引用值指向同一块内存

  ```javascript
  var data = new Array(3).fill(new Array(3))
  ```

![stack-heap](../image/language/stack_heap.png)

##### 为什么分为堆和栈

* JavaScript 引擎需要用栈来维护程序执行期间上下文的状态
* 所有的数据都存放在栈空间里面，会影响到上下文切换的效率，进而又影响到整个程序的执行效率
* 因此，栈空间不会太大，存放原始类型的小数据，堆空间比较大，存档较多大数据





### 17. `str.charAt(index)` 和 `str[index]` 的区别

* 当 index 的取值不在 str 的长度范围内时

  `str[index]` 返回 `undefined`，`charAt(index)`返回空字符串；

* `str[index]` 不兼容 ie6 - ie8，`charAt(index)`可以兼容

* `str[index]` 不易区分变量的类型，是字符串还是数组



## 二、作用域

> 红宝书中也称作用域为执行环境

> **LHS查询**—查找目标
> 变量出现在赋值操作的左侧时
> 查找变量 并试图为变量赋一新值
>
> **RHS查询**—查找源头
> 变量出现在赋值操作的右（非左）侧时
> 查询并获取变量的值
>
> —— 《你不知道的 JS》

> 活动对象和变量对象其实是一个东西
>
> VO：变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明；是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问
>
> AO：只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，能访问该对象的各种属性。被激活的变量对象即活动对象

### 1. JS 作用域分为哪几类，作用域大小怎么定义？

> 作用域是根据名称查找变量的一套规则
>
> 欺骗词法作用域的方法有：`eval`，`with`

JavaScript 采用词法作用域模型，即作用域在写代码时进行静态确定，主要关注在何处声明

> 函数的作用域在函数定义的时候就决定了，与何处调用无关

![图例](https://static001.geekbang.org/resource/image/21/39/216433d2d0c64149a731d84ba1a07739.png)

JavaScript 中的作用域包含：

* 全局作用域
* 函数作用域：属于这个函数的全部变量都可以在整个函数的范围内使用及复用
* 块级作用域：将变量绑定到所在的任意作用域中（通常是{ .. }内部）



### 2. let, var 区别

首先，从作用域角度看，`var` 声明的变量可以使用在**全局作用域以及函数作用域**中，而 `let` 声明的变量是限制在**块级作用域**中的。所以，在最程序顶部声明时，`var` 会**向全局对象添加属性**，`let` 不会。

其次，`var` 会进行**变量提升**处理，因此将声明放在其所在作用域的任一行都可以，在被赋值前返回值为 `undefined`，但 `let` 不会，在声明前是不可访问的。受 `let` 这一特点的影响，在执行到 `let` 初始化语句前，存在**暂存死区**，如果使用该变量会抛出 `ReferenceError`，提示不能在初始化前取到该变量。

最后，`var` 在同个作用域内可**重复声明**，后面的值会覆盖前面的值，但 `let` 在同个作用域内如重复声明，会抛出语法错误，提示不要重复声明。这个在写 `switch` 语句时会碰到，因为 ``switch``语句为一个块作用域。



### 3. 何为提升

这里我认为可以分为广义和狭义理解

广义上讲，提升，指的是所有声明都会被移动到所在作用域的顶部。

这是因为 JavaScript 引擎在执行代码前会进行编译，在这过程中将声明的变量关联其所在作用域，而赋值及其他逻辑会等到运行时进行。

狭义上，指的是 `var` 所具有的变量提升的特点。

这是因为在处理`var` 声明时，除绑定作用域外，还进行了初始化，设为 `undefined`。而`let`，`const`  没有初始化，所以没有变量提升。

在这部分还需要注意的是，函数表达式的表现和变量声明相似，只会提升声明本身，不提升赋值，但函数声明会全部提升，包含函数体。类 `class` 虽然本质是一个函数，但只会提升声明，需要在初始化后再创建实例，否则也会抛出错误。



### 4. 为什么需要块级作用域

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



### 5. ES6 前如何使用块级作用域

[MDN - with](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)

**第一种**，可以使用 `with`。

`with` 将一个对象添加到作用域链顶部，处理为一个被隔离的词法作用域。

其括号中语句的赋值操作，会对属性进行 LHS查询。

在非严格模式下，当整个作用域链中都不存在该变量时，会在全局作用域中创建该变量，并进行赋值。

ES5 严格模式下已被禁用，会抛出语法错误。

它是一种欺骗词法作用域的方式。

**第二种**，是使用 `try/catch` 语句，其中 `catch` 分句会创建一块作用域 。

**第三种**，使用匿名函数

Babel 处理这部分转换是比较灵活的，如：

* 处理循环中带异步时，除 `let` 声明变为 `var` 外，将相关异步操作变为一函数，控制在新的函数作用域内
* 在重复声明方面，`let` 处理为 `var` 时，如变更会引起重复声明，则修改一方的变量名

```javascript
// 匿名函数
(function(){
	// 块级
})()
```

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



### 6. 作用域链

[JavaScript深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6)

> 函数有 [[scope]]，[[scope]] 就是所有父变量对象的层级链
>
> 执行上下文有 Scope，作用域链

当查找变量的时候，会先从当前上下文的变量对象中查找

如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找

一直找到全局上下文的变量对象，也就是全局对象。

这样由多个执行上下文的变量对象构成的链表就叫做作用域链。



## 三、垃圾回收

[一文搞懂V8引擎的垃圾回收](https://juejin.cn/post/6844904016325902344)

> 默认情况下，V8引擎在`64`位系统下最多只能使用约`1.4GB`的内存，在`32`位系统下最多只能使用约`0.7GB`的内存
>
> **V8引擎可用内存不多的原因**：
>
> ①作为浏览器端JavaScript的执行环境，没有必要将最大内存设置得过高 
>
> ②由于JS的单线程机制，垃圾回收的过程阻碍了主线程逻辑的执行。垃圾回收本身也是一件非常耗时的操作，如果内存使用过高，那么必然会导致垃圾回收的过程缓慢，也就会导致主线程的等待时间越长，浏览器也就越长时间得不到响应。

### 1. 垃圾回收机制

[JavaScript高级程序设计 P78]()

**是什么**

执行环境管理代码执行过程中内存使用的一种机制

主要为：找出那些不再继续使用的变量，然后释放其占用的内存

**为什么**

如果不及时进行垃圾回收，会导致没有新的内存被释放，从而引发内存泄漏导致程序的性能直线下降甚至崩溃

及时释放内存有利于提高内存的利用率

**怎么做的**

> JavaScript 中的垃圾收集策略有标记清除（最常用），引用计数（不太常见）
>
> - 标记清除：在运行时给存储在内存中的所有变量都加上标记，将环境中的及被环境引用的变量去除标记，最后删除带标记的变量
> - 引用计数：跟踪每个值被引用的次数。但它无法处理循环引用的问题（现代浏览器基本已放弃此种策略）

> 代际假说：
>
> 第一个是大部分对象在内存中存在的时间很短，简单来说，就是很多对象一经分配内存，很快就变得不可访问；
>
> 第二个是不死的对象，会活得更久

> 垃圾回收器主要分三步走：标记活动对象非活动对象；回收非活动对象；内存整理

V8的垃圾回收策略主要是基于**分代式垃圾回收机制**，其根据**对象的存活时间**将内存的垃圾回收进行不同的分代，然后对不同的分代采用不同的垃圾回收算法。

* 在 V8 中会把堆分为**新生代和老生代**两个区域。新生代中存放的是生存时间短的对象，老生代中存放的生存时间久的对象

* 垃圾回收的过程主要出现在新生代和老生代

* **对象晋升**（从新生代到老生代）的条件（或，不是与）：

  * 对象是否经历过一次`Scavenge`算法
  * `To`空间的内存占比是否已经超过`25%`

* `新生代(new_space)`：大多数的对象开始都会被分配在这里，这个区域相对较小但是<u>垃圾回收特别频繁</u>，该区域被分为两半，<u>一半用来分配内存，另一半用于在垃圾回收时将需要保留的对象复制过来</u>。

  * 通常只支持 1~ 8 M；副垃圾回收器
  * `Scavenge`算法是一种典型的牺牲空间换取时间的算法，浪费了一半的内存用于复制
  * 当进行垃圾回收时，如果`From`空间中尚有<u>存活</u>对象，则会被复制到`To`空间进行保存，非存活的对象会被自动回收。当复制完成后，`From`空间和`To`空间完成一次<u>角色互换</u>

* `老生代(old_space)`：新生代中的对象在存活一段时间后就会被转移到老生代内存区，<u>相对于新生代该内存区域的垃圾回收频率较低</u>。老生代又分为`老生代指针区`和`老生代数据区`，前者包含大多数可能存在指向其他对象的指针的对象，后者只保存原始数据对象，这些数据没有指向其他对象的指针。

  * 主垃圾回收器

  * 采用新的算法`Mark-Sweep(标记清除)`和`Mark-Compact(标记整理)`来进行管理

  * `Mark-Sweep(标记清除)`分为`标记`和`清除`两个阶段，在标记阶段会从一组根元素开始**递归**遍历，然后标记活着的对象（判断某个对象是否可以被访问到），在清除阶段中，会将死亡的对象进行清除

  * **标记清除算法**的缺点在于所清理的对象的内存地址可能不是连续的，所以就会出现<u>内存碎片</u>

  * **标记整理**主要用于解决这一问题。在标记阶段后，进入整理阶段，将活动对象往堆内存的另一端移动。清除阶段时，将存有死亡对象的一侧全部清除

  * 老生代存放的活动对象多，处理耗时长（全停顿），为减少卡顿的时间，引入**增量标记**的概念。先标记堆内存中的一部分对象，然后暂停，将执行权重新交给JS主线程，待主线程任务执行完毕后再从原来暂停标记的地方继续标记，直到标记完整个堆内存
  
    > 有点像`React`框架中的`Fiber`架构，异步可中断更新
    >
    > 这里是异步可中断垃圾回收

<img src="../image/language/JS-V8内存结构图.jpg" alt="图例" style="zoom:67%;" />，



### 2. 如何避免内存泄露

[面试题：什么是内存泄漏？内存溢出？](https://zhuanlan.zhihu.com/p/69151763)

> **内存溢出**就是你要求分配的内存超出了系统能给你的，系统不能满足需求，于是产生溢出

**是什么**

内存泄漏是指你向系统申请分配内存进行使用(new)，可是使用完了以后却不归还(delete)，结果你申请到的那块内存你自己也不能再访问，且系统也不能再次将它分配给需要的程序

**为什么**

内存泄漏会导致程序的性能直线下降甚至崩溃

当页面运行卡顿时，就有可能发生内存泄露

**怎么做**

* 尽量避免使用全局变量，如在全局作用域中使用 `var` 声明变量

  * 垃圾回收器会在内部构建一个`根列表`，用于从根节点出发去寻找那些可以被访问到的变量，而 `window` 对象可视为一根节点，会被视为存活的对象，常驻内存，不进行垃圾回收，直到进程退出。
  * 如使用全局变量，尽量**在使用完毕后将值置为 `null`**，解除引用，触发回收机制

* 及时清除定时器 `setInterval`

* **避免过度使用闭包**

  * 存在变量引用，作用域未释放

* 清除 DOM 引用

  * 存储 DOM 元素后，即使使用 `Node.removeChild` 后，由于存在引用，内存没有被释放

* 使用弱引用

  > 弱引用是指垃圾回收的过程中不会将键名对该对象的引用考虑进去，只要所引用的对象没有其他的引用了，垃圾回收机制就会释放该对象所占用的内存

  * 相关数据结构`WeakMap`和`WeakSet`



## 四、闭包

[10 | 作用域链和闭包 ：代码中出现相同的变量，JavaScript引擎是如何选择的？](https://time.geekbang.org/column/article/127495)

> 基于词法作用域书写代码所产生的自然结果
>
> —— 《你不知道的  JS》

**是什么**

> 一般来说，我们在查找变量时，在本地作用域中查找不到就会沿着作用域链从内向外单向查找，但是闭包的特性可以让我们在外部作用域访问内部作用域中的变量

闭包是有权访问另一个函数作用域中的变量的函数

**为什么**

> 产生闭包的核心有两步：第一步是需要预扫描内部函数；第二步是把内部函数引用的外部变量保存到堆中

虽然创建它的执行上下文在执行完毕后，从执行栈中移出，

但闭包的执行上下文并没有被销毁

根据词法作用域规则，内部函数总是可以访问其外部函数中声明的变量

此时内部函数引用外部函数的变量依然保存在内存中

其执行上下文的作用域链依然保存了创建它的执行上下文的活动对象

因此还能访问到该函数作用域中的变量值

> 1. 在后台执行环境中，闭包的作用域链包含它自己的作用域，包含函数的作用域和全局的作用域
>
> 2. 通常情况下，函数作用域及其变量会在函数执行结束后被销毁
>
> 3. 但，当函数返回一闭包时，该函数的作用域会一直被保存直到闭包不存在。

**特点**

* 正因为闭包携带了包含完整的作用域链，包含理应被销毁的另一函数作用域的活动对象，它会阻止垃圾回收机制释放内存，比其他函数<u>占用更多空间</u>，所以需要避免过度使用闭包

  > 闭包保存了整个变量对象（AO / VO）

**例子**

> 红宝书中的例子：使用闭包提供公有方法访问私有对象属性

一个常见的例子为借助闭包在使用 `var` 的 `for` 循环中如何捕获当次循环的值

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

在 React 中，也会借助闭包的特性。

如类组件和函数组件的一大区别在于：

类组件会捕获最新的值，而函数组件会捕获当次的值

这在设置事件监听，或使用 `setTimeout` 等处理异步操作时会遇到。

类组件可借助闭包捕获到当次的值，如在 render 中存当次 props 的值，再传入需要处理的函数。

函数组件捕获最新值通常借助 ref 实现。

**需要注意的地方**

> 如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。

受垃圾回收机制策略影响，在某些老版浏览器（IE9 之前），如闭包的作用域链中保存 HTML 元素，则该元素将无法被销毁



## 五、this

[再来40道this面试题酸爽继续(1.2w字用手整理)](https://juejin.cn/post/6844904083707396109)

> this 是执行上下文的一个属性，代表<u>函数调用时函数使用的上下文</u>，是一个对象

> this 是在运行时基于函数的执行环境绑定的
>
> this 不指向函数自身也不指向函数的词法作用域，完全取决于函数在哪里被调用

### 0. 根据规范如何确定 this

[JavaScript深入之从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)

> MemberExpression : `()`左边的部分
>
> IsPropertyReference：如果 base value 是一个对象，就返回 true

1.计算 MemberExpression 的结果赋值给 ref

2.判断 ref 是不是一个 Reference 类型

```
2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

2.3 如果 ref 不是 Reference，那么 this 的值为 undefined
```



### 1. 判断 this 绑定对象

> 优先级依次降低，低优先级的修改方法无法修改高优先级

1. **箭头函数**：继承外层函数调用的 this 绑定（同 ES6 前的 `self=this`）

   由外层作用域决定，且指向函数定义时的 this

   箭头函数的`this`是无法通过`bind、call、apply`来**直接**修改，但是可以通过改变作用域中`this`的指向来间接修改。

   可作为实例方法，确保 `this` 总是指向类实例

   * 避免以下使用方式
     * 定义对象的方法 
     * 定义原型的方法
     * 定义构造函数
     * 定义回调函数
   * 字面量创建的对象，作用域是`window`，如果里面有箭头函数属性的话，`this`指向的是`window`

2. **由 new 调用**：绑定到新创建的对象。

   ```javascript
   function Test1() {
       this.a = 1;
   }
   
   const Test2 = Test1.bind({a: 2})
   const t1 = new Test1();
   const t2 = new Test2();
   
   console.log(t1.a, t2.a); // 1 1
   ```

3. **由 bind 调用**：绑定到指定的对象。

   一个绑定函数能使用new操作符创建对象

   ```javascript
   const test = {
       x: 42,
       getX: function () {
           return this.x;
       }
   };
   
   const boundGetX = test.getX.bind(test);
   const changeGetX = boundGetX.call({x: 1});
   console.log(boundGetX(), changeGetX); // 42 42
   ```

4. **由 call 或者 apply 调用**：绑定到指定的对象。

5. **由上下文对象调用**：绑定到那个上下文对象。

   丢失this绑定（隐式丢失）的形式：<u>函数别名；参数传递（隐式赋值）；回调函数等</u>

6. **默认**：在严格模式下绑定到undefined，否则绑定到全局对象。

   可使用 `globalThis` 引用全局对象



### 2. 箭头函数与普通函数区别

[详解箭头函数和普通函数的区别以及箭头函数的注意事项、不适用场景](https://juejin.cn/post/6844903801799835655)

> 原型，this（从哪来，能不能改，全局），参数，new

**原型**

* 箭头函数没有`prototype`

**this指向**

* 箭头函数本身没有`this`。`this` 指向定义时所在外层的第一个普通函数，会随该函数 `this` 指向的改变而改变
* 普通函数的 `this` 取决于在哪被调用，怎么调用

**能否修改 this**

* 箭头函数不能直接修改它的this指向，可以去修改被继承的普通函数的this指向来间接修改
* 普通函数可以通过 `call`，`apply`，`bind` 直接修改 `this`

**全局作用域的 this 指向**

* 箭头函数在严格和非严格模式下都绑定到 `window`
* 普通函数在严格模式下绑定到 `undefined`，否则绑定到全局对象 `window`。

**new**

> ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`          —— [阮一峰 - ES6 入门](https://es6.ruanyifeng.com/?search=new.target&x=0&y=0#docs/class#new-target-%E5%B1%9E%E6%80%A7)

* 箭头函数不能做构造函数，使用 `new` 会抛出错误
* 箭头函数不支持`new.target`

**参数**

* 箭头函数的 `this` 指向全局时，使用 `arguments` 会报未声明的错误；`this` 指向普通函数时，`arguments` 继承自该普通函数；查找方式类似于作用域链查询

  可以使用 ES6 的 `rest` 参数（即 `...` 扩展符）来获取不定数量的参数

**迭代**

* 箭头函数不可以使用 yield 命令，因此不能用作 Generator 函数



### 3. 为什么箭头函数不能做构造函数

[Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/101)

- 没有自己的 this
- 没有 prototype 属性 
- 而 new 实例化对象的过程中，会将对象的原型连接到构造函数的原型上，且使用 `call` 或 `apply` 将 `this` 指向实例调用构造函数



### 4. call、apply、bind区别

> [`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。
>
> [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。
>
> [`bind()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

都是改变函数内 `this` 指向，区别在于：

* 使用`.call()`或者`.apply()`的函数是会直接执行的
* `bind()`是创建一个新的函数，需要手动调用才会执行
* `.call()`和`.apply()`用法基本类似，不过`call`接收若干个参数，而`apply`接收的是一个数组

[模拟 call / apply / bind 实现](http://localhost:3000/#/handwrite/JavaScript-hw?id=%e4%ba%8c%e3%80%81this)



### 5. new 原理

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



### 1. `new`  和 `Object.create()` 的区别 

[js继承实现之Object.create](https://segmentfault.com/a/1190000014592412)

* `new` 运算符只接受构造函数；`Object.create` 除构造函数外，还可以接受箭头函数，普通对象，null
* `Object.create` 如传入构造函数，则不会继承原有构造函数中的属性；如为对象，则会继承原对象的属性。
* 可以借 `Object.create` 实现没有原型的空对象，`new` 不行

完整总结见：[JS 基础 | new 和 Object.create() 有什么区别](https://blog.csdn.net/qq_44537414/article/details/114401207)

[模拟 Object.create 实现](handwrite/JavaScript-hw?id=_3-%e5%a6%82%e4%bd%95%e6%a8%a1%e6%8b%9f-objectcreate)



### 2. `Object.defineProperty` 与 `proxy`

[ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)

[Object.defineProperty() —— MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

[Proxy - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

[到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/gaExqjCt49EqElAaFTcgjA)

> 误入 Vue 坑了 哈哈哈

> vue 2 使用 defineProperty 通过 getter / setter 进行数据劫持
>
> vue 3 换成 Proxy, 存在向下兼容问题

> Object.defineProperty(obj, prop, descriptor)

> 属性描述符包含 `value`，`writable`（可写），`enumerable`（可枚举）和 `configurable`（可配置）等

> 如果一个描述符同时拥有 `value` 或 `writable` （数据描述符）和 `get` 或 `set` （存取描述符） 键，则会产生一个异常

Proxy

- 代理的是**对象**
- 可以拦截到数组的变化
- 拦截的方法多达13种
- 返回一个拦截后的数据
- 浏览器支持度较 `Object.defineProperty` 更差

Object.defineProperty

- 代理的是**属性**
- 对数组数据的变化无能为力
- 只能重定义属性的读取（get）和设置（set）行为
- 直接修改原始数据
- 兼容性好,支持IE9

```javascript
(function(){
    var root = this;
    function watch(obj, name, func){
        var value = obj[name];

        Object.defineProperty(obj, name, {
            get: function() {
                return value;
            },
            set: function(newValue) {
                value = newValue;
                func(value)
            }
        });

        if (value) obj[name] = value
    }

    this.watch = watch;
})()

var obj = {
    value: 1
}

watch(obj, "value", function(newvalue){
    document.getElementById('container').innerHTML = newvalue;
})

document.getElementById('button').addEventListener("click", function(){
    obj.value += 1
});
```

```javascript
(function() {
    var root = this;

    function watch(target, func) {

        var proxy = new Proxy(target, {
            get: function(target, prop) {
                return target[prop];
            },
            set: function(target, prop, value) {
                target[prop] = value;
                func(prop, value);
            }
        });

        return proxy;
    }

    this.watch = watch;
})()

var obj = {
    value: 1
}

var newObj = watch(obj, function(key, newvalue) {
    if (key == 'value') document.getElementById('container').innerHTML = newvalue;
})

document.getElementById('button').addEventListener("click", function() {
    newObj.value += 1
});
```



### 3. 生成器 Generator

[Generator - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)

[【转向 Javascript 系列】深入理解 Generators](http://www.alloyteam.com/2016/02/generators-in-depth/)

[ES6 系列之 Generator 的自动执行](https://github.com/mqyqingfeng/Blog/issues/99)

> **生成器**对象是由一个 [generator function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*) 返回的,并且它符合[可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)和[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)

> 生成器函数用 function*声明，使用 yield 返回值。
>
> run-pause-run 模式，即生成器函数可以在函数运行中被暂停一次或多次
>
> 根据需要多次调用该函数，并且每次都返回一个新的Generator，但每个Generator只能迭代一次

> 生成器是 ES6 的一个新的函数类型，可以在运行时被暂停，并在之后恢复。
>
> 交替的暂停和恢复是合作性的而非抢占式。
>
> 为异步代码保持了顺序，同步，阻塞的代码模式。
>
> —— 《你不知道的 JS 中卷》

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let g = gen();
g.next();
g.next();
g.next();
g.next();
```

**运行原理：**

* Regenerator 通过工具函数将生成器函数包装，为其添加如 next/return 等方法。
* 同时也对返回的生成器对象进行包装，使得对 next 等方法的调用，最终进入由 switch case 组成的**状态机模型**中。
* 除此之外，利用闭包技巧，保存生成器函数上下文信息。

[Babel Try it out](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=usage&spec=false&loose=false&code_lz=GYVwdgxgLglg9mAVAAgKYA8CGBbADgG1QAoBKZAbwChlkBPGVfAE2QEYBuauh55AJk416jFgGZOAX0oA3TACdkMKKjkBeDDgLESnJSoB0YDFFLsgA&debug=false&forceAllTransforms=true&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Cstage-0&prettier=true&targets=&version=7.13.12&externalPlugins=)



### 4. for of , for in 和 forEach,map 的区别

[【面试篇】寒冬求职季之你必须要懂的原生JS(上)](https://juejin.cn/post/6844903815053852685#heading-2)

**`for of` 遍历数组元素，`for in` 遍历对象属性**

- for...of循环：具有 iterator 接口， 遍历就可以用for...of循环遍历它的成员(属性值)。for...of循环可以使用的范围包括<u>数组、Set 和 Map 结构、某些类似数组的对象、Generator 对象，以及字符串</u>。for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。**可以中断循环**。
- for...in循环：遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值。**可以中断循环**。
- forEach: **只能遍历数组，不能中断**，没有返回值(或认为返回值是undefined)。
- map: **只能遍历数组，不能中断**，返回值是修改后的数组

```javascript
let arr = [1, 2, 3]
let obj = {
    a: 1,
    b: 2
}

for(let i of arr) {
    console.log(i);
}

for (let i in arr) {
    console.log(arr[i]);
}

for (let i in obj) {
    console.log(i);
}
```



### 5. 迭代器 iterator

[迭代器和生成器 — MDN](https://es6.ruanyifeng.com/#docs/iterator)

[ECMAScript 6 入门 — 迭代器](https://es6.ruanyifeng.com/)

> 什么是迭代器？javascript都有哪些迭代器？如何实现一个迭代器？

> 迭代器是一种支持next()操作的**对象**。它包含了一组元素，当执行next()操作时，返回其中一个元素。
> 当所有元素都被返回后，再执行next()报异常—StopIteration
> 生成器一定是可迭代的，也一定是迭代器对象

**和生成器的关系**

当执行一生成器函数时，就得到了迭代器

**是什么**

> 迭代器是通过使用 `next()` 方法实现 [Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) 的任何一个对象，该方法返回具有两个属性的对象： `value`，这是序列中的 next 值；和 `done` ，如果已经迭代到序列中的最后一个值，则它为 `true` 。如果 `value` 和 `done` 一起存在，则它是迭代器的返回值。

一个对象，它定义一个序列，并在终止时可能返回一个返回值

**作用**

一是为各种数据结构，提供一个统一的、简便的访问接口；

二是使得数据结构的成员能够按某种次序排列；

三是 ES6 创造了一种新的遍历命令`for...of`循环，Iterator 接口主要供`for...of`消费。

**可迭代对象**

若一个对象拥有迭代行为，那么那个对象便是一个可迭代对象

为了实现**可迭代**，一个对象必须实现 **@@iterator** 方法，即带有 [`Symbol.iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) 属性

```javascript
var myIterable = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}

```

只能迭代**一次**的 Iterables（例如Generators）通常从它们的**@@iterator**方法中返回它**本身**，其中那些可以**多次**迭代的方法必须在每次调用**@@iterator**时返回一个**新的迭代器**。

* [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)、[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)、[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 



## 七、原型

> “JavaScript中的机制有一个核心区别，那就是不会进行复制，对象之间是通过内部的[[Prototype]]链关联的。”          ——《你不知道的 JavaScript》

每个对象上都有原型的引用，查找属性时，如对象本身不具备该属性，则会在原型上查找该属性。

每个对象的原型也可以有一个原型，以此类推，构成了原型链。

### 0. 常用操作符 / 方法

> * 使用`for...in...`能获取到实例对象自身的属性和原型链上的属性
> * 使用`Object.keys()`和`Object.getOwnPropertyNames()`只能获取实例对象自身的属性
> * 可以通过`.hasOwnProperty()`方法传入属性名来判断一个属性是不是实例自身的属性

* `in`  - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)

  > 无论属性是否可枚举

  指定的属性在指定的对象或其原型链，如 `'make' in car`

* `hasOwnProperty` - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

  对象自身是否具有该属性，如 `object1.hasOwnProperty('property1')`

* `instanceof` - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

  构造函数的 `prototype` 属性是否出现在某实例的原型链上，如 `apple instanceof fruit`

* `isPrototypeOf` - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

  对象是否存在于另一对象的原型链上，如 `Apple.prototype.isPrototypeOf(a)`



### 1. `prototype` ， `__proto__` ，`[[Prototype]]`区分

[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)

[现代 JavaScript 教程 - 原型继承](https://zh.javascript.info/prototype-inheritance)

每个函数都有一个 `prototype` 属性，指向该构造函数将会创建的实例的原型，它的值为某一对象或 `null`，默认为 `Object`的实例 ；

每一对象都有一个**内置**属性 `[[Prototype]]`，无法直接访问，它的值为某一对象或 `null`；

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

但需要注意的是，如果我们将 ``prototype`` 完全替换， ``constructor`` 属性也会发生改变。

```javascript
function Parent() {}
function Child() {}

console.log(Child.prototype.constructor); // [Function: Child]

Child.prototype = Object.create(Parent.prototype);
console.log(Child.prototype.constructor); // [Function: Parent]

Child.prototype = new Parent();
console.log(Child.prototype.constructor); // [Function: Parent]

Child.prototype = {a: 'a'};
console.log(Child.prototype.constructor); // [Function: Object]

Child.prototype = 'a';
console.log(Child.prototype.constructor); // [Function: String]

Child.prototype = null;
// TypeError: Cannot read property 'constructor' of null
console.log(Child.prototype.constructor); 
```



### 3. `__proto__` 的替代项

> 当`Object.prototype.__proto__` 已被大多数浏览器厂商所支持的今天，其存在和确切行为仅在ECMAScript 2015规范中被标准化为传统功能.
>
> 出于性能考虑，应尽量避免使用 `Object.setPrototypeOf` 修改原型，使用 `Object.create` 替代   —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)

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



### 6. 原型

[JavaScript高级程序设计 P147]()

* 每个函数都有一个 `prototype` 属性，指向一个对象
* 该对象包含可以由特定类型的所有实例共享的属性和方法，称为"原型"
* 使用原型对象的好处在于：可以共享包含的属性和方法
* 受其共享的特点影响，一般在原型中定义共享的属性方法，在构造函数中定义实体属性
* 原型对象通常会自动获得指向构造函数（`prototype`指向该原型的函数）的 `constructor` 属性
* 重写原型对象时，会切断现有原型和之前所有已存在的对象实例的关系，并会修改 `constructor`。
* 之前所有已存在的对象实例引用的仍是最初的原型



### 7. 原型链

[如何回答面试中的JavaScript原型链问题](https://zhuanlan.zhihu.com/p/356980105)

> 由相互关联的原型组成的链状结构就是原型链

**概念**

原型链是指由 `__proto__` 串起来的一条链路

在对象上查找属性时，如对象本身不具有该属性，则会通过 `__proto__`，到对象的原型对象中查找，如原型对象中也未找到，再向上一层原型对象中查找，直到 `Object.prototype` 的 `__proto__` 指向 `null`。

这一过程中，形如 `实例.__proto__.__proto__` 就是原型链。

**实践：比如画个图**

[ES6—类的实现原理](https://segmentfault.com/a/1190000008390268)

```javascript
class A {}
class B extends A {}

const b = new B();
```

<img src="../image/language/JS-原型链1.jpg" alt="原型链1" style="zoom:80%;" />

```javascript
function A() {}
function B() {}

B.prototype = Object.create(A.prototype);

const b = new B();
```

<img src="../image/language/JS-原型链2.jpg" alt="原型链图例" style="zoom:80%;" />

注意：使用 `class` 继承时，子类构造函数的 `__proto__` 会指向父类，这是因为 `extends` 的实现中有这一步。但使用函数进行继承操作并不会！

```javascript
function Parent1(name) {
    this.name = name
}

function Child1(name) {
    Parent1.call(this, name);
}

Child1.prototype = Object.create(Parent1.prototype);

const a = new Child1('a');
console.log(a);
console.log(Child1.__proto__, Parent1);

class Parent2 {
    constructor(name) {
        this.name = name;
    }
}

class Child2 extends Parent2 {
    constructor(props) {
        super(props);
    }
}

const b = new Child2('b');
console.log(b);
console.log(Child2.__proto__, Parent2);
```



## 八、继承

> JavaScript 主要通过**原型链**实现继承。                      —— 《JavaScript高级程序设计》

> 继承意味着复制操作，JavaScript（默认）并不会复制对象属性。相反，JavaScript会在两个对象之间创建一个关联，这样一个对象就可以通过委托访问另一个对象的属性和函数。
>
> JavaScript中的机制有一个核心区别，那就是**不会进行复制**，对象之间是通过内部的[[Prototype]]链关联的。
>
> **委托**行为意味着某些对象在找不到属性或者方法引用时会把这个请求委托给另一个对象。
>
> JavaScript的<u>[[Prototype]]机制本质上就是行为委托机制</u>。                         —— 《你不知道的 JS》

[JavaScript高级程序设计 P162]()

[JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)

[【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)](https://juejin.cn/post/6844904098941108232)

[【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)](https://juejin.cn/post/6844904094948130824)

[Class 的继承](https://es6.ruanyifeng.com/#docs/class-extends)

<img src="../image/language/JS-继承.jpg" alt="继承图例总览" style="zoom:80%;" />



> 区别主要在于处理顺序不同
>
> ES5 的继承，实质是<u>先创造子类的实例对象`this`</u>，然后<u>再将父类的方法添加到`this`上面</u>（`Parent.apply(this)`）。
>
> ES6 的继承机制完全不同，实质是<u>先将父类实例对象的属性和方法，加到`this`上面</u>（所以必须先调用`super`方法），然后<u>再用子类的构造函数修改`this`</u>。



**继承就是子类可以使用父类的所有功能，并且对这些功能进行扩展**  => 复用



各种继承方式可依次问以下几个问题（灵魂五问）：

* 能取到父类实例属性方法/原型属性方法吗？
* 是否存在各子类实例共享父类实例属性的情况？
* 可以实现多继承，向父类构造函数传参吗？
* 能否使用 `instanceof` 判断子类实例和父类的关系？
* 构造函数被调用了几次？父类方法是能否复用？（使用 `new`，`Object.create` 可复用，只有 `call` 无复用 ）



### 1. 原型链继承

使用 `new` 运算符

**优点**：

可取到父类实例属性方法及原型属性方法

**缺点**：

包含引用类型值的原型，会导致父类实例属性被所有实例<u>共享</u>；

无法实现<u>多继承</u>；无法向<u>父类构造函数传参</u>

```javascript
function Parent () {
    this.name = 'kevin';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {

}

// 关键代码
Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName(), child1) // kevin
```

### 2. 构造函数继承

使用 `call` 或 `apply` 在子类构造函数中调用父类构造函数

**优点**：

解决引用类型属性被<u>共享</u>的问题；

<u>可实现多继承</u>（父类实例属性方法）；可以向父类构造函数<u>传参</u>

**缺点**：

只能取到父类实例属性及方法，<u>无法取到父类原型属性及方法</u>；

无法<u>函数复用</u>，复制了父类构造函数中的属性和方法，每个子类都有父类实例函数的副本，影响性能

无法用 `instanceof` 判断子类与父类关系，<u>子类非父类的实例</u>；

```javascript
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {
    // 关键代码
    Parent.call(this);
}

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]
```

### 3. 组合继承

使用 `new` 和 `call`（`apply`）

**优点**：

可继承父类实例属性方法，也继承了父类原型属性方法

解决共享实例属性的问题；

可复用函数；

可多继承（父类实例属性方法）；可向父类构造函数传参；

**缺点：**

<u>父类构造函数调用两次</u>，生成了两个实例

子类实例中的属性和方法会覆盖子类原型(父类实例)上的属性和方法，所以<u>增加了不必要的内存</u>。

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
	// 关键代码
    Parent.call(this, name);
    this.age = age;

}

// 关键代码
Child.prototype = new Parent();
// 关键代码
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

### 4. 原型式继承

> 本质是一个浅拷贝

使用 `Object.create` 

[ES5 | 模拟 Object.create 实现](handwrite/JavaScript-hw?id=_3-%e5%a6%82%e4%bd%95%e6%a8%a1%e6%8b%9f-objectcreate)

**优点**：

未使用父类构造函数，降低代码量

父类原型方法能复用

**缺点**：

只能取到父类原型属性及方法，不能取到父类实例属性及方法；

引用类型，存在被所有实例共享的情况；

无法实现多继承；

无法向父类构造函数传参；

```javascript
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}

var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

// 关键代码
var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.firends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

### 5. 寄生式继承

使用 `Object.create` ，再对生成的对象添加属性

**优点**：

未使用父类构造函数；

父类原型方法部分能复用

**缺点：**

只能继承父类原型属性方法，无法继承父类实例属性方法；

存在实例共享实例属性的情况；

不能函数复用（指手动添加的对象属性），效率低；

无法传参，无法多继承；

```javascript
function createObj (o) {
    var clone = Object.create(o);
    // 和原型式的主要区别 ↓
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

### 6. 寄生组合继承

使用 `Object.create` 和 `call`（`apply`）

**优点：**

可以取到父类实例属性方法，父类原型属性方法；

解决实例共享父类实例属性的问题；

父类构造函数只使用一次；

可多继承父类实例属性方法，可传递参数；

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
	// 关键代码
    Parent.call(this, name);
    this.age = age;
}
// 关键代码
Child.prototype = Object.create(Parent.prototype);
// 关键代码
Child.prototype.constructor = Parent;

var child1 = new Child('kevin', '18');

console.log(child1)
```

### 7. 混入方式继承

>  `Object.assign`，ES6

解决前面没有办法多继承父类原型属性方法的问题

使用 `Object.assign`

此处需要注意的地方是：`instanceof` 只能判断使用 `Object.create` 的父类

```javascript
function MyClass() { 
    // 关键代码
    SuperClass.call(this);
    OtherSuperClass.call(this);
}

// 关键代码
MyClass.prototype = Object.create(SuperClass.prototype);

// 关键代码 ↓
Object.assign(MyClass.prototype, OtherSuperClass.prototype);

// 关键代码
MyClass.prototype.constructor = MyClass;

// 在之类上附加方法
MyClass.prototype.myMethod = function() {
  // do sth
};
```

### 8. Class 继承

> `class`本质虽然是个函数，但是并不会像函数一样提升至作用域最顶层

> `class` 只是现有[[Prototype]]（委托！）机制的一种**语法糖**

**特点**

* 在`constructor`中`var`一个变量，它只存在于`constructor`这个构造函数中
* 在`constructor`中使用`this`定义的属性和方法，在`class`中使用`=`来定义一个属性和方法会被定义到实例上
* 在`class`中直接定义一个方法，会被添加到`原型对象prototype`上
* 在`class`中使用了`static`修饰符定义的属性和方法被认为是静态的，被添加到类本身，不会添加到实例上

**super**

* 用于产生实例 `this`
* `super`当成函数调用时，<u>代表父类的构造函数，且返回的是子类的实例</u>，也就是此时`super`内部的`this`指向子类。在子类的`constructor`中`super()`就相当于是`Parent.constructor.call(this)`
  * 只能在构造函数中使用
  * `this` 的使用必须放在 `super` 后
* `super`当成对象调用时，<u>普通函数中`super`对象指向父类的原型对象，静态函数中指向父类</u>。且通过`super`调用父类的方法时，`super`会绑定子类的`this`，就相当于是`Parent.prototype.fn.call(this)`

**extends**

- `extends`后面接着的目标不一定是`class`，只要是个有`prototype`属性的函数就可以了

**实现原理**

[ES6—类的实现原理](https://segmentfault.com/a/1190000008390268)

* class：

  `class a(){}` => `var a = function(){return a}()`

* constructor

  转为给对象添加属性，`Object.create`

* extends 

  原型链，设置 `subClass.__proto__ = superClass`

```javascript
var base = 'window';

class Food {
    constructor(name) {
        // 构造函数中有效
        var base = 'food';
        // 实例属性
        this.name = name;
        this.from  = 'food';
        console.log('Food constructor:', base);
    }

    // 使用 = 来定义一个属性和方法会被定义到实例上
    getName = function () {
        console.log('Food:', this.name)
    }

    // 直接定义一个方法，会被添加到原型对象上
    getBase() {
        console.log('Food getBase:', base);
        console.log('this:', this.from);
    }
}

Food.getPrice = function () {
    console.log('free');
}

class Rice extends Food {
    constructor(name) {
        // 当成函数调用时, 代表父类的构造函数，且返回的是子类的实例
        var instance = super(name);
        this.from = 'rice';
        console.log(instance);
        // this 指向子类
        console.log(instance === this);
        // 在子类的普通函数中super对象指向父类的原型对象
        // this 指向子类
        super.getBase();
    }

    static getFoodPrice() {
        // 在子类的静态方法中super对象指向父类
        super.getPrice();
    }
}

const r = new Rice('dongbei')
Rice.getFoodPrice();
```



## 九、函数

### 0. 函数式编程

[JS函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)

[前端开发js函数式编程真实用途体现在哪里？ - Wang Namelos的回答 - 知乎 ](https://www.zhihu.com/question/59871249/answer/170400954)

> JavaScript 并不是函数式编程语言, 只是兼容了一部分 FP 方法风格的使用技巧

**特点**

* 数据不可变
* 纯函数：输出可预期，没有副作用
* 组合性

**代数效应**

[写给那些搞不懂代数效应的我们（翻译）](https://zhuanlan.zhihu.com/p/76158581)

> 代数效应是从函数式编程中脱胎的。它所解决的一部分问题只在纯函数式编程中才存在

它允许我们跳回执行效应的代码继续执行，并且还可以夹带一点私货。



### 1. IIFE

[译\] JavaScript：立即执行函数表达式（IIFE）](https://segmentfault.com/a/1190000003985390)

立即执行函数。可用于保存闭包状态，捕获当前值。

**坑点：** 前一表达式必须加 `;`，不会自动加

- 当圆括号出现在匿名函数的末尾想要调用函数时，它会默认将函数当成是函数声明。
- 当圆括号包裹函数时，它会默认将函数作为表达式去解析，而不是函数声明。

```javascript
(function(){/* code */}());//Crockford recommends this one，括号内的表达式代表函数立即调用表达式
(function(){/* code */})();//But this one works just as well，括号内的表达式代表函数表达式
```

```javascript
// 模块模式
var counter = (function(){
    var i = 0;
    return {
        get: function(){
            return i;
        },
        set: function(val){
            i = val;
        },
        increment: function(){
            return ++i;
        }
    }
}());
counter.get();//0
counter.set(3);
counter.increment();//4
counter.increment();//5

conuter.i;//undefined (`i` is not a property of the returned object)
i;//ReferenceError: i is not defined (it only exists inside the closure)
```



### 2. 函数柯里化

**是什么**

柯里化是一种函数的转换，将一个函数从可调用的 `f(a, b, c)` 转换为可调用的 `f(a)(b)(c)`。它并<u>不会调用函数</u>。

如果参数数量不足，则返回偏函数。

通俗来说，即为每次调用函数时，它只接受一部分参数，并返回一个函数，直到传递所有参数为止。

**为什么**

* 参数复用
* 提前返回：返回只接受一部分参数的参数
* 延迟执行：直到接收完所有函数后才执行

**要求**

柯里化要求函数<u>具有固定数量的参数</u>

**怎么实现的**

[模拟 curry](handwrite/JavaScript-hw?id=_1-函数柯里化)



## 十、深浅拷贝

[第 4 期：深浅拷贝原理](https://github.com/yygmind/blog#%E7%AC%AC-4-%E6%9C%9F%E6%B7%B1%E6%B5%85%E6%8B%B7%E8%B4%9D%E5%8E%9F%E7%90%86)

### 1. 深浅拷贝区别

* 深拷贝会拷贝所有的属性，并拷贝属性指向的动态分配的内存。当对象和它所引用的对象一起拷贝时即发生深拷贝。深拷贝相比于浅拷贝速度较慢并且花销较大。拷贝前后两个对象互不影响。
* 浅拷贝会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

| --     | 和原数据是否指向同一对象 | 第一层数据为基本数据类型     | 原数据中包含子对象           |
| ------ | ------------------------ | ---------------------------- | ---------------------------- |
| 赋值   | 是                       | 改变会使原数据一同改变       | 改变会使原数据一同改变       |
| 浅拷贝 | 否                       | 改变**不**会使原数据一同改变 | 改变会使原数据一同改变       |
| 深拷贝 | 否                       | 改变**不**会使原数据一同改变 | 改变**不**会使原数据一同改变 |



### 2. 展开语法与 `Object.assign` 的区别

[[译] Object.assign 和 Object Spread 之争, 用谁？](https://juejin.cn/post/6844903774620762120#heading-1)

> 展开语法(Spread syntax), 可以在函数调用/数组构造时, 将数组表达式或者string在语法层面展开；还可以在构造字面量对象时, 将对象表达式按key-value的方式展开。  —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

> `Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。   —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

均为 **浅拷贝**。

* `{... obj}` 等同于 `Object.assign（{}，obj）`
* `Object.assign（）`修改了一个对象，因此它会触发 [ES6 setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)。使用时，需要保证第一个参数为 `{}`
* 展开语法更符合 [immutable](https://facebook.github.io/immutable-js/) 的思想



### 3. `JSON.parse(JSON.stringify(object))` 进行深拷贝的缺点

```javascript
var new_data = JSON.parse(JSON.stringify(data));
```

1、会忽略 `undefined`

2、会忽略 `symbol`

3、不能序列化函数

4、不能解决循环引用的对象

5、不能正确处理`new Date()`

6、不能处理正则



## 十一、异步

[Javascript异步编程的4种方法](https://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)

[JS 异步编程：种类和原理](https://hytonightyx.github.io/fedoc/03-JavaScript/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B%E4%B8%93%E9%A2%98.html)

ES6 诞生以前，异步编程的方法，大概有下面四种。

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象



### 1. 回调函数

优点是简单、容易理解

缺点有：

* **错误处理困难**
  * 回调函数发生错误时，无法使用 try-catch 来处理错误。由于事件循环机制，回调执行和 try-catch 不会位于同一步骤中；
  * 因此，一般回调函数要手动传入 err，来处理错误，也就产生了大量样板代码

* **回调地狱**
  * 回调套回调，执行连续步骤非常棘手

* **代码耦合，维护困难**
* 每个任务只能指定一个回调函数



### 2. 事件监听

任务的执行不取决于代码的顺序，而取决于某个事件是否发生

优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以（Decoupling），有利于实现[模块化](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)

缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。



### 3. 发布/订阅

与"事件监听"类似，但是可以了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

[模拟发布订阅模式](http://localhost:3000/#/handwrite/design-patterns-hw?id=_2-%e5%8f%91%e5%b8%83%e8%ae%a2%e9%98%85-emitter)



### 4. Promise

[【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)](https://juejin.cn/post/6844904077537574919)

**是什么**

> **Promise** 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。   —— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

**为什么**

原有回调函数式异步编程方案，嵌套层级多时，代码难以维护

`promise` 将嵌套调用改为链式调用

**注意点**

* `.then`和`.catch`都会返回一个新的`Promise`，返回任意一个非 `promise` 的值都会被包裹成 `promise` 对象

* `.catch` 只会捕获最先的那个异常

* `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值透传，如为语句，其实会执行

* **`.then` 或者 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，所以不会被后续的 `.catch` 捕获**，`throw` 或 `Promise.reject()`会被捕获

* `.finally()`方法不管`Promise`对象最后的状态如何都会执行，**回调不接受任何参数**，最终返回的默认会是一个**上一次的Promise对象值**

* 链式调用后面的内容需要等前一个调用执行完才会执行

* 紧跟着 `await` 后面的语句相当于放到了 `new Promise` 中，下一行及之后的语句相当于放在 `Promise.then` 中

* 如果在 `async` 函数中抛出了错误，则终止错误结果，不会继续向下执行

#### 几种状态，怎么改变

一个 `Promise` 必然处于以下几种状态之一，且 **`Promise` 的状态一经改变就不能再改变**：

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。

```javascript
new Promise(r => console.log('pending'))
// pending
// Promise {<pending>}
```

- 已兑现（fulfilled）: 意味着操作成功完成。

```javascript
new Promise(r => r('fulfilled'))
// Promise {<fulfilled>: "fulfilled"}
```

- 已拒绝（rejected）: 意味着操作失败。

```javascript
new Promise((resolve, reject) => reject('rejected'))
// Promise {<rejected>: "rejected"}
```

![Promise 链式调用](../image/language/js-promises.png)



[模拟 Promise / async / await]()

#### Promise.all与Promise.race有什么区别

* `.all()`的作用是接收一组异步任务，然后并行执行异步任务，并且在**所有异步操作执行完**后才执行回调。

* `.race()`的作用也是接收一组异步任务，然后并行执行异步任务，**只保留取第一个执行完成的异步操作**的结果，其他的方法仍在执行，不过执行结果会被抛弃。
* `all` 和 `race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被`then`的第二个参数或者后面的`catch`捕获；但并不会影响数组中其它的异步任务的执行。



## 十二、事件循环

[详解JavaScript中的Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)

[Node.js 事件循环，定时器和 `process.nextTick()`](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

[【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)](https://juejin.cn/post/6844904077537574919)

> JavaScript 是一门单线程的非阻塞的脚本语言
>
> 单线程主要是为保证程序执行的一致性（如多线程则可同时操作DOM，复杂同步）

**是什么**

是一种解决 Javascript 单线程运行时不阻塞的机制

**为什么**

遇到耗时任务，同步任务效率低，事件循环机制可以让 JS 具有处理异步的能力，提高效率，从而实现”非阻塞“

**怎么做的**

| 宏任务                  | 浏览器 | Node |
| :---------------------- | ------ | ---- |
| `I/O`                   | ✅      | ✅    |
| `setTimeout`            | ✅      | ✅    |
| `setInterval`           | ✅      | ✅    |
| `setImmediate`          | ❌      | ✅    |
| `requestAnimationFrame` | ✅      | ❌    |

| 微任务                       | 浏览器 | Node |
| ---------------------------- | ------ | ---- |
| `process.nextTick`           | ❌      | ✅    |
| `MutationObserver`           | ✅      | ❌    |
| `Promise.then catch finally` | ✅      | ✅    |

1. 浏览器
   * 引擎执行过程中遇到异步事件，将事件挂起，先继续执行执行栈中的其他任务
   * 异步任务返回结果后，将其回调函数加入到任务队列
   * 执行栈的任务执行完毕后，主线程去查看任务队列中是否有任务
   * 有，则将首位任务取出，将回调函数放入执行栈，执行同步代码
   * 如遇到异步代码，则继续重复开头的流程
   * 其中，任务队列分为微任务队列和宏任务队列，先清空微任务队列，再处理宏任务队列。同次事件循环中，微任务总在宏任务前执行。

![浏览器事件循环机制](../image/language/JS-浏览器事件循环机制.png)

2. Node.js
   * node 中的事件循环存在于 libuv 引擎中
   * 在I/O事件的回调中，`setImmediate` 方法的回调永远在 `timer` 的回调前执行，否则，两种方法的次序无法判断
   * 每个阶段都有一个 FIFO 队列来执行回调
   * 任何时候在给定的阶段中调用 `process.nextTick()`，所有传递到 `process.nextTick()` 的回调将在事件循环继续之前解析
   * 各个阶段：
     * **定时器**：本阶段执行已经被 `setTimeout()` 和 `setInterval()` 的调度回调函数。
     * **待定回调**：执行延迟到下一个循环迭代的 I/O 回调。
     * **idle, prepare**：仅系统内部使用。
     * **轮询**：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 `setImmediate()` 调度的之外），其余情况 node 将在适当的时候在此阻塞。
     * **检测**：`setImmediate()` 回调函数在这里执行。
     * **关闭的回调函数**：一些关闭的回调函数，如：`socket.on('close', ...)`。

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

![图例](../image/language/JS-node事件循环.png)



## 十三、模块化

> 模块模式，利用闭包特性实现数据私有化的形式
>
> ES6的模块没有“行内”格式，必须被定义在独立的文件中（一个文件一个模块）
>
> 模块有两个主要特征：
>
> （1）为创建内部作用域而调用了一个包装函数；
>
> （2）包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包。
>
> —— 《你不知道的 JS》

[前端模块化的十年征程](https://mp.weixin.qq.com/s/oYQf_m-TvH2txc1AfAvtsA)

[前端模块化的前世今生](https://mp.weixin.qq.com/s/88q3P-rRDxVSD7HJxYAigg)

[npm install的实现原理？](https://www.zhihu.com/question/66629910/answer/273992383)

[前端科普系列-CommonJS：不是前端却革命了前端](https://zhuanlan.zhihu.com/p/113009496)

[commonJS 和 ES Module 区别](https://zhuanlan.zhihu.com/p/161015809)

[前端的发展](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/1-1%E5%89%8D%E7%AB%AF%E7%9A%84%E5%8F%91%E5%B1%95.html)

[《模块化系列》彻底理清 AMD,CommonJS,CMD,UMD,ES6](https://juejin.cn/post/6844904066233925639)

![模块化](../image/language/JS-模块化.jpg)

模块化 = IIFE + 闭包 + 对象

**是什么**

广义上来解释

- 外部的模块: 指代引入前端工程的某个外部的包(package),可能由多个JS文件组成，但会通过入口暴露给我们项目调用
- 内部的模块: 指代我们自己的工程项目中编码的最小单元： 即单个的JS文件

**为什么**

代码量提升后，多文件直接导入存在命名冲突，污染全局作用域等问题，难以维护

**模块化不光要处理全局变量污染、数据保护的问题，还要很好的解决模块之间依赖关系的维护**

1. 变量都拥有了自己的作用域，而不是直接挂载到全局，有效解决了<u>命名冲突</u>。
2. 让所有的模块都保持单一职责，显著的提升了<u>开发效率</u>以及代码的<u>可维护性</u>。
3. 重复代码不再通过拷贝，而是通过模块引入的方式实现，提升了代码的复用性。
4. 可以使用包管理工具，直接在使用网络上开源的模块。

**怎么做**

> CMD正是在sea.js推广的过程中逐步确立的规范，并不是CMD诞生了sea.js。相反，是sea.js诞生了CMD。
>
> CMD和AMD并不是互斥的，require.js和sea.js也并不是完全不同，实际上，通过阅读API文档我们会发现，CMD后期规范容纳了AMD的一些写法。

1. 外部模块管理

   * 下载文件，`script` 引入

   * NPM ，一个远程的JavaScript代码仓库，解决了外部模块的管理问题

2. 内部模块组织

   > 除 ES Module 外，都是运行时加载；ES Module 为编译时加载

   * 原生 JS，借助 IIFE 组织模块，尽量避免污染全局作用域

     特点：复杂依赖关系难处理，同步加载易卡顿，命名冲突

   * **CommonJS** 的模块化方案是JavaScript社区第一次在模块系统上取得的成果

     不仅支持依赖管理，而且还支持作用域隔离和模块标识
   
     * 缺少模块封装的能力：一个模块一个文件，浏览器不友好，需要发较多请求
  * 使用同步的方式加载依赖：可能导致浏览器长时间白屏
     * `module.exports` 保存当前模块要导出的内容；`require` 加载导出值
     * Node.js 在实现 CommonJS 规范时，为每个模块提供一个 `exports`的私有变量，指向 `module.exports`。直接赋值是无效的。
     
     > 当时 Node.js 也采用了 `CommonJS` 的模块化规范
     >
     > v13.2 版本开始，Node.js 已经默认打开了 ES6 Module 的支持，但需要：
  >
  >   > 1. 更改 `.js` 为 `.mjs`，并使用 `node index.mjs`
  >
  >2. `package.json`添加字段`"type": "module"`，如此所有 `.js` 均被识别为 ES Module

* **AMD** 设计规范，异步模块定义 => `define` / `require`
  
  `define` 能自定义模块而 `require` 不能，`require` 的作用是执行模块加载
  
  特点：依赖前置，数组形式提前声明；<u>异步加载</u>，避免阻塞；直接返回值
  
* **CMD** 设计规范，通用模块定义 => 接受 factory 函数 
  
  `require` 为动态获取依赖模块，倾向懒加载
  
     特点：就近调用 `require` 动态引用依赖；异步加载，避免阻塞；`module.exports` 形式返回
  
   * **ES Module** 是 ES 组织官方推出的模块化方案，相比于 CommonJS 和 AMD 方案，ESM采用了<u>完全静态化</u>的方式进行模块的加载，静态化也为后来的打包工具提供了便利，并且能友好的支持 tree shaking

```javascript
// CMD
define(function(requie, exports, module){    
	//依赖就近书写
	var module1 = require('Module1');
	var result1 = module1.exec();
    module.exports = {
      result1: result1,    
	}
});

// AMD
define(['Module1'], function(module1){  
	var result1 = module1.exec();
    return {
		result1: result1,
	}
});
```

```javascript
// ES6
import { foo } from './foo';
export const bar = 1;

// CommonJS
const foo = require('./foo');
module.exports = {
	bar: 1
}
```

##### ESM 与 CommonJS 的差异

![图表对比](../image/language/JS-模块化方案区别.jpg)

* 语法：

  一个使用 `import/export` 语法，一个使用 `require/module.exports` 语法。

* 引入形式：

  CommonJS 输出是值的拷贝，模块内部的变化就影响不到导出值；

  ES6 Module 输出的是值的引用，被输出模块的内部的改变会影响引用的改变；

* 提升：

  ES6 Module 是编译时加载，因此会将 `import` 提升到模块头部

  CommonJS 是运行时加载，没有提升的效果

* 缓存

  ES6 Module 不会做缓存

  CommonJS 引入模块后会做缓存，即第二次引入时依然使用第一次引入时的值，即使值可能已被修改

* `this` 指向：

  ES6 Module 默认开启严格模式 `this`指向`undefined`

  CommonJS `this`指向当前模块

```javascript
// a.js
const mod = require('./b')

setTimeout(() => {
  console.log(mod) // first value
}, 1000)

// b.js
let mod = 'first value'

setTimeout(() => {
  mod = 'second value'
}, 500)

module.exports = mod
```

```javascript
// a.mjs
import { mod } from './b.mjs'

setTimeout(() => {
  console.log(mod) // second value
}, 1000)

// b.mjs
export let mod = 'first value'

setTimeout(() => {
  mod = 'second value'
}, 500)
```



## 十四、追新

> ES2015 对应 ES6，之后每年一版依次增加，如 ES7 指的是 ES2016 

[ES6、ES7、ES8、ES9、ES10新特性一览](https://juejin.cn/post/6844903811622912014)

### 1. 常用的 ES6 特性

[ES6 标准](https://262.ecma-international.org/6.0/)

- 类  [更多](language/JavaScript?id=_8-class-继承)

- 模块化 [更多](language/JavaScript?id=十三、模块化)

- **箭头函数** [更多](language/JavaScript?id=_2-箭头函数与普通函数区别)

- 函数参数默认值

- 模板字符串

- **解构赋值**

  ```javascript
  [a, b] = [b, a];
  const {name,age,city} = student;
  ```

- **延展操作符**

  ```javascript
  var arr3 = [...arr1, ...arr2];
  var mergedObj = { ...obj1, ...obj2 }; // ES2018 支持对象
  ```

- 对象属性简写 / 表达式

  ```javascript
  const student = { name, age, city };
  const key = 'key';
  const data = { [key]: '1' };
  ```

- Promise

- **let**，**const**

- **`for of` / `forEach` / ** 

- Map / Set

### 2. 最近的新特性





## 十五、异步网络请求

[异步网络请求xhr、ajax、fetch与axios对比](https://juejin.cn/post/6844904058466074637)

[传统 Ajax 已死，Fetch 永生](https://github.com/camsong/blog/issues/2)



### 1. XMLHttpRequest

[XML HttpRequest — MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

**优点：**

- 不重新加载页面的情况下更新网页
- 在页面已加载后从服务器请求/接收数据
- 在后台向服务器发送数据。

**缺点：**

- 使用起来也比较繁琐，需要设置很多值。
- 早期的IE浏览器有自己的实现，这样需要写兼容代码。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log("Oops, error");
};

xhr.send();
```



### 2. AJAX

[AJAX — MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX/Getting_Started)

[面试官：ajax原理是什么？如何实现？](https://github.com/febobo/web-interview/issues/70)

异步的JavaScript和XML，即使用 XMLHttpRequest 和服务器通信

使用JSON，XML，HTML和text文本等格式发送和接收数据

可以在不重新刷新页面的情况下与服务器通信，交换数据，或更新页面



### 3. fetch

[fetch — MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

**优点：**

* 语法简洁，更加语义化
* 基于标准 Promise 实现，支持 async/await
* 支持跨域，添加 `mode: 'no-cors'` 即可

**缺点：**

- `fetch`只对网络请求报错，对`400`，`500`都当做成功的请求，需要封装去处理
- `fetch`默认不会带`cookie`，需要添加配置项。
- `fetch`不支持`abort`，不支持超时控制，使用`setTimeout`及`Promise.reject`的实现超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费。
- `fetch`没有办法原生监测请求的进度，而`XHR`可以。

```javascript
fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function(e) {
  console.log("Oops, error");
});
```

```javascript
try {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
} catch(e) {
  console.log("Oops, error", e);
```





## 十六、一些定义

### 1. 为什么是解释型语言

[JavaScript到底是解释型语言还是编译型语言?](https://mp.weixin.qq.com/s/neqAVDUqHA4_qoswk-VWHw)

> **JavaScript (** **JS** ) 是一种解释型或即时编译型的编程语言 - MDN

解释型语言指在运行时将程序转化为机器语言



### 2. 什么是执行上下文

[JavaScript深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)

[JavaScript深入之执行上下文](https://github.com/mqyqingfeng/Blog/issues/8)

> 在进入执行上下文时，首先会处理函数声明，其次会处理变量声明

执行上下文（execution context），是对 JavaScript 代码执行环境的抽象。

它包含变量对象（Variable object，VO），作用域链，this 等。

当执行一段代码时，即会创建对应的执行上下文。

* 变量对象就是执行环境中包含了所有变量和函数的对象
* 活动对象是函数执行的时候被创建的对象

```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```



### 3. 严格模式

[严格模式 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)

ES5 引入严格模式，支持渐进式引入。

严格模式对正常的 JavaScript语义做了一些更改。

1. 将问题直接转为错误，消除了一些原有**静默错误**
2. 简化如何为给定名称的特定变量计算
3. 简化 eval 和 arguments
4. 写"安全“JavaScript的步骤变得更简单
5. 严格模式**禁用了**在ECMAScript的未来版本中可能会定义的一些语法

**示例**

问题转为错误：

* 禁止自动或隐式创建全局变量，会抛出 ReferenceError
* 如对不可写的属性类型进行修改，不会出现静默失败，而会抛出 TypeError
* 试图删除不可删除属性，会抛出 TypeError
* 参数重名，会抛出错误
* 禁止八进制数字语法，即 `0o` 前缀

简化变量使用

* wth 被完全禁止
* 不能使用 eval 为上层引入新变量
* 禁止删除声明变量

简化 eval 和 arguments

* 不能被赋值或绑定到其他语句（类似于保留关键字？）
* 对参数重新赋值，不会影响 arguments
* 不再支持 `arguments.callee`

写"安全“JavaScript的步骤变得更简单

* this 的默认绑定，会绑定到 undefined
* `arguments`不会再提供访问与调用这个函数相关的变量的途径，如 `arguments.caller`

减轻之后版本改变产生的影响

* 将一部分字符变成保留关键字，如 `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`和`yield`
* 只支持在全局或函数中进行函数声明



## 十七、其他

### 1. `encodeURIComponent` 和 `encodeURI` 的区别

[encodeURIComponent - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

[encodeURI - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)

* 两个都会转义空格为 `%20`

* 两个都不转义以下字符：

  ```
  A-Z a-z 0-9 - _ . ! ~ * ' ( )
  ```

* `encodeURI` 不会转义保留字符 `;,/?:@&=+$`，`encodeURIComponent` 会转义

* `encodeURI` 不会转义 `#` ，`encodeURIComponent` 会转义为 `%23`



### 2. 类数组对象

[JavaScript深入之类数组对象与arguments](https://github.com/mqyqingfeng/Blog/issues/14)



### 3. 自动分号

[极客时间 - 重学前端]()

JavaScript提供了相对可用的分号补全规则，包括

1.有**换行符**，且**下一个符号是不符合语法**的，尝试插入分号

```javascript
let a = 1
let b = 1
```

2.有**换行符**，且语法规定**此处不能有换行符**，自动插入分号

![图例](https://cdn.nlark.com/yuque/0/2020/jpeg/451516/1587483534093-7d0ac863-9068-4c34-97e3-996739f8a20c.jpeg)

3.代码结束处，**不能形成完整的脚本或模块结构**，自动插入分号

**！以下情况需要注意：**

0. 带换行符的注释也被认为是有换行符

1. **括号开头**  IIFE 立即执行函数表达式！

2. **数组开头**

3. **斜杠开头**  正则表达式！

4. **反引号开头**  模板字符串！



### 4. 剩余参数和 `arguments` 的区别

[剩余参数 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters#%E5%89%A9%E4%BD%99%E5%8F%82%E6%95%B0%E5%92%8C_arguments%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%8C%BA%E5%88%AB)

- 剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。
- `arguments`对象不是一个真正的数组，而剩余参数是真正的 `Array`实例，也就是说你能够在它上面直接使用所有的数组方法，比如 `sort`，`map`，`forEach`或`pop`。
- `arguments`对象还有一些附加的属性 （如`callee`属性）。