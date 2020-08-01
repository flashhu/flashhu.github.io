### 情景
**示例一**

```javascript
//正常调用
function getData() {
	...	
}

window.onload = getData;
```
嗯？`getData`不是一个函数吗？
参照[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions)中的例子，不是应该用`getData()`这样的形式调用函数？
```javascript
//正常调用
function getData() {
	...	
}

window.onload = getData();
```


**示例二**
```javascript
//正常调用
document.getElementById("box").onclick = handleClick();

function handleClick(){
	...
}
```
```javascript
//不报错，结果有异常
document.getElementById("box").onclick = handleClick;

function handleClick(){
	...
}
```

*？？？*
***
### 原因分析
仔细查看会发现，上述示例调用函数的形式均为`obj.event=func`
而印象中函数调用的一般形式为`func()`

**? 为什么示例一不加括号后也能正常运行呢**
[What is the different between window.onload = init(); and window.onload = init;](https://stackoverflow.com/questions/8830074/what-is-the-different-between-window-onload-init-and-window-onload-init/8830126#8830126)

* `window.onload = getData()`表示马上执行`getData`函数，结果赋予`qindow.onload`
* `window.onload = getData`表示当`onload`事件被触发时，执行`getData`函数

示例代码产生了示例一前后都可以正常运行，示例二前后会发生异常的错觉，主要原因在事件不一样
***
### 总结
* 一般情况下，函数调用形式为`func()`  [JavaScript 函数调用](https://www.w3school.com.cn/js/js_function_invocation.asp)
* 当将函数分配给某一对象的具体属性时，注意区分`func()`，以及`func`。当使用场景为发生某一事件执行函数时，使用`func`