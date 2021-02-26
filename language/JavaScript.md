> 并不只为面试题，更是知识梳理

## 一、基本概念

### 1. `null` 和 `undefined` 啥区别

[undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

首先，两个都是基础类型。区别主要在于：

在语义上，`null` 指已定义但值为空，`undefined` 指未赋值的自然状态，如声明未赋值的变量；

受历史设计原因影响：

在转换为数值类型时，`null` 会被转为 0，`undefined` 会转为`NaN`；

```javascript
Number(null)
// 0
Number(undefined)
// NaN
```

在使用`typeof`操作符时，`null` 会得到 `object`，`undefined` 会得到 `undefined`；

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



### 2. `null` 是不是对象

 `null` 不是对象。

`typeof null` 得到的返回值为 `object`是由于对象在底层用二进制表示，二进制前三位都为0的话会被判断为 `object` 类型。而 `null` 的二进制表示为全0，所以被误判为 `object`。



### 3. 基础类型有哪些





### 4. 类型转换



### 5. 关键字/保留字



## 二、作用域

### 1. let, var 区别

首先，从作用域角度看，`var` 声明的变量可以使用在全局作用域以及函数作用域中，而 `let` 声明的变量是限制在块级作用域中的。所以，在最程序顶部声明时，`var` 会向全局对象添加属性，`let` 不会。

其次，`var` 会进行变量提升处理，因此将声明放在其所在作用域的任一行都可以，在被赋值前返回值为 `undefined`，但 `let` 不会，在声明前是不可访问的。受 `let` 这一特点的影响，在执行到 `let` 初始化语句前，存在暂存死区，如果使用该变量会抛出 `ReferenceError`，提示不能在初始化前取到该变量。

最后，`var` 在同个作用域内可重复声明，后面的值会覆盖前面的值，但 `let` 在同个作用域内如重复声明，会抛出语法错误，提示不要重复声明。这个在写 `switch` 语句时会碰到，因为 ``switch``语句为一个块作用域。



### 2. 何为提升

这里我认为可以分为广义和狭义理解

广义上讲，提升，指的是所有声明都会被移动到所在作用域的顶部。

这是因为 JavaScript 引擎在执行代码前会进行编译，在这过程中将声明的变量关联其所在作用域，而赋值及其他逻辑会等到运行时进行。

狭义上，指的是 `var` 所具有的变量提升的特点。

这是因为在处理`var` 声明时，除绑定作用域外，还进行了初始化，设为 `undefined`。而`let`，`const`  没有初始化，所以没有变量提升。

在这部分还需要注意的是，函数表达式的表现和变量声明相似，只会提升声明本身，不提升赋值，但函数声明会全部提升，包含函数体。



### 3. 模块化演变





## 三、闭包

## 四、垃圾回收

## 五、this

### new 原理



## 六、对象

## 七、继承

## 八、原型

## 九、函数

### 1. 函数柯里化

## 十、追新

### 1. 常用的 ES6 特性

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









