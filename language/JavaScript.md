> 知识是有关联的 ：）

## 一、数据类型

### 1. 基础类型有哪些

> ES5：5 + 1；ES6 / ES2015：6 + 1；ES10 / 2019：7 + 1

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



### 4. `string` 类型的长度

[【JS迷你书】String类型与UTF-16](https://juejin.cn/post/6844903841817690119)

首先，`string` 类型指的是字符串的 UTF16 编码。

我们常用的如 `length` 方法等都是针对 UTF16 编码的，把每个`UTF16`单元当作是一个字符来处理。

因此，字符串的最大长度实际受字符串的编码长度影响，通常说最大长度为 2^53 - 1。



### 5. 说说 `symbol`  ？

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



### 7. 类型判断的方法 ？

[JavaScript专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

[判断数据类型的那些坑](https://zhuanlan.zhihu.com/p/26061496)

[javascript中的类型判断](https://zhuanlan.zhihu.com/p/38249035)

[极客时间-重学前端](https://time.geekbang.org/column/article/78884)

通常，在判断自定义类时，使用`instanceof`；

其余情况使用`Object.prototype.toString` 解决。

类型判断的方式主要有四种：

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

**`instanceof` 适合用于对对象子类型进行有预期的类型判断（是不是某一类的实例）**

还可以使用 [`Symbol.hasInstance`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)，自定义`instanceof`在某一类上的行为

```javascript
console.log([1, 2] instanceof Array) // true
console.log(new Date() instanceof Date) // true
console.log(1 instanceof Number) // false
console.log(new Number(1) instanceof Number) // true
```

```javascript
// 一些特殊的例子
console.log( Function instanceof Function ); // true
console.log( Function instanceof Object ); // true
console.log( Object instanceof Function ); // true
console.log( Object instanceof Object ); // true
```

* TODO：补充原因

```javascript
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true
```

[模拟 instanceof 实现](handwrite/JavaScript-hw.md?id=_2-如何模拟instanceof)

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

**`Object.prototype.toString` 适合用于内置类型的类型判断**



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

  `Array.prototype.slice([begin[, end]])` 浅拷贝了原数组中元素的一新数组

  `Array.prototype.splice(start[, deleteCount[, item1[, item2[, ...]]]])` 删除/替换/添加元素

![数组操作](../image/language/array-method.png)

* Date
* RegExp
* Error



### 16. 基本数据类型和复杂数据类型存储上的区别

> 即，原始值、引用值的区别

* 基本数据类型存在**栈**中，直接存入的是值。

  复杂数据类型在**栈**中存入的是地址，该地址指向**堆**内存，在堆内存存入的是具体值。

* 基本数据类型是**值拷贝**，拷贝的是具体值；复杂数据类型是**引用拷贝**，拷贝的指向堆内存的引用地址。因此，我们将对象赋值给新的变量时，如使用新变量对属性进行修改，会影响原有变量指向的值，因为两个变量指向同一块内存空间

* 常见例子还有为二维数组初始化时，如使用下方示例代码创建，会导致在修改某行时，所有行均改变，因为此时存引用值指向同一块内存

  ```javascript
  var data = new Array(3).fill(new Array(3))
  ```

![stack-heap](../image/language/stack_heap.png)



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



### 1. `new`  和 `Object.create()` 的区别 ？

> 好家伙 这居然真是道面试题 

[js继承实现之Object.create](https://segmentfault.com/a/1190000014592412)

* `new` 运算符只接受构造函数；`Object.create` 除构造函数外，还可以接受普通对象，null
* `Object.create` 如传入构造函数，则不会继承原有构造函数中的属性；如为对象，则会继承原对象的属性。
* 可以借 `Object.create` 实现没有原型的空对象，`new` 不行

完整总结见：[JS 基础 | new 和 Object.create() 有什么区别](https://blog.csdn.net/qq_44537414/article/details/114401207)

> 待解决疑问：`Object.create()` 创建的对象的 this 指向



## 七、原型

> “JavaScript中的机制有一个核心区别，那就是不会进行复制，对象之间是通过内部的[[Prototype]]链关联的。”          ——《你不知道的 JavaScript》

每个对象上都有原型的引用，查找属性时，如对象本身不具备该属性，则会在原型上查找该属性。

每个对象的原型也可以有一个原型，以此类推，构成了原型链。

### 0. 常用操作符 / 方法

* `in`  - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)

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

但需要注意的是，如果我们将 ``prototype`` 完全替换，会不再具有 ``constructor`` 属性。



### 3. `__proto__` 的替代项

> 出于性能考虑，应尽量避免使用 `Object.setPrototypeOf` 修改原型，使用 `Object.create` 替代

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



## 八、继承

### 1. 原型继承

* 给原型添加方法的代码要放在替换原型语句之后
* 问题1：注意引用类型的特殊性，容易出现数据共享的问题
* 问题2：不能向父类的构造函数中传递参数

### 2. 类式继承

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

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









