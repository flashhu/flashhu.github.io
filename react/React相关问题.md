# React 相关问题

## 一. 基础

### 1. React Element 和 React Component 的区别

* 在`React`中，`React.createElement()`的返回值为`React Element`

  在[源码](https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react/src/jsx/ReactJSXElementValidator.js#L66)中，`React Element` 的判断标准为 包含属性`$$typeof` 且值为 `REACT_ELEMENT_TYPE` 的对象

* `React Component` 通常作为`React.createElement()`的第一个参数 `type` 传入。我们常使用类组件，函数组件来构建。区分是否为类组件，可使用实例原型上的方法判断

```javascript
class AppClass extends React.Component {
  render() {
    return <p>KaSong</p>
  }
}
console.log('这是ClassComponent：', AppClass);
console.log('这是Element：', <AppClass/>);
            
console.log(AppClass instanceof Function, AppFunc instanceof Function);
// true true
console.log(AppClass.prototype.isReactComponent);
// {}  undefined

// console
这是ClassComponent：
class AppClass extends React.Component {
  render() {
    return <p>KaSong</p>
  }
}
这是Element：
[object Object] {
  $$typeof: [object Symbol] { ... },
  _owner: null,
  _store: [object Object] { ... },
  key: null,
  props: [object Object] { ... },
  ref: null,
  type: class AppClass {...}
}
}
                      
// 函数组件同理
```

### 2. JSX 与 Fiber 区别

> 在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。
>
> 在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`。

* JSX 为一种描述当前组件内容的数据结构
* Fiber节点中包含组件 schedule, reconcile, renderer 所需的信息，如组件更新的优先级，state, 用于 renderer 的标记

### 虚拟DOM

> **JS 和 DOM 之间的一个映射缓存**
>
> 虚拟 DOM 的劣势主要在于 JS 计算的耗时，而 DOM 操作的能耗和 JS 计算的能耗根本不在一个量级

* 虚拟 DOM 是对真实 DOM 的描述
* 虚拟 DOM 为 JS 对象 
  * 挂载：JSX => React.createElement => 虚拟DOM树 (React Element) => render => 真实DOM
  * 更新：diff => 需要变的虚拟 DOM => 真实DOM
* 旧的虚拟 DOM 树 = **diff** => 需要更新的内容 = **patch** => 真实DOM => 新的虚拟 DOM 树

**为什么出现**

> 交互少，原生JS => 交互变多，jQuery 对 DOM API封装 
>
> =数据驱动=> DOM操作量大，模板引擎方案，早期为整体注销再渲染 =>  虚拟DOM

1. 主要目的不是为提高性能，而是为提高研发效率及体验：

   ①数据驱动视图，②实现跨平台，一套虚拟DOM对接不同平台的具体逻辑

2. 该种方案并不一定能带来最好的性能，只是相对不错

   ① 性能问题影响因素多，虚拟 DOM 在更新了大部分真实DOM时，表现不一定比其他方案好

   ②批量更新

### super(props)

[Why Do We Write super(props)?](https://overreacted.io/why-do-we-write-super-props/)

1.`super`指父类（React中一般指 `React.Component`）的构造函数。在调用父类的构造函数前，不能在构造函数中使用`this`关键字。防止出现在定义前，调用执行到某变量的情况。

2.传入`props`，为`React.Component`构造函数能初始化`this.props`。虽然**`React`在调用构造函数后也立即将`props`赋值到实例上**， 但为防止`this.props`在`super`调用到构造函数结束期间为`undefined`，还是应传入 props

### 函数式组件和类组件的区别

* 类组件，基于ES6 Class的写法
* 函数组件，函数形态存在；没有出现Hooks时，内部无法定义和维护state

**不同点**

* 类组件需要继承 class，函数组件不需要；

* 类组件可以访问生命周期方法，函数组件不能；

* 类组件中可以获取到实例化后的 this，并基于这个 this 做各种各样的事情，而函数组件不可以；

* 类组件中可以定义并维护 state（状态），而函数组件不可以；

[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

> 函数组件会捕获 render 内部的状态（把数据和渲染绑定到了一起），这是两类组件最大的不同。

* 函数式组件捕获了渲染所使用的值( props/state )，可通过设置ref 取到最新值
* 类组件捕获了最新的值，可通过提前保存值再显式传递，render() 使用写闭包取到渲染所使用的值（React中props, state不可变）

### `setState`同步，还是异步？

* 避免频繁`re-render` ，setState是异步的

* 采用“批量更新”，同一周期内进行批处理，按顺序进行浅合并    [相关问答](https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973)

  如第一次 {a:10}, 第二次 {a:30, b:20}, 最后结果为 {a:30, b:20}

* React16及以前，可借`setTimeout`将其执行顺序从异步变为同步，是因为表示锁状态的变量`isBatchingUpdates`在`setTimeout`调用时，已从`true`被重置成了`false`, 主要受事务机制，批量更新机制的影响

* React17中，`batcjedUpdates`已被`lane`优先级模型代替，默认全部批处理

### 事务机制



## 二、进阶

### 为什么用 getDerivedStateFromProps 代替 componentWillReceiveProps

> 与 componentDidUpdate 一起，这个新的生命周期涵盖过时componentWillReceiveProps 的所有用例
>
> => 试图代替 / 不能完全等同

* 对API做“减法”，利于确保生命周期函数行为的可控性，可预测性
* 避免开发者对生命周期的滥用，如陷入死循环的setState
* 静态方法，拿不到组件实例的 this
* 实现基于props派生state

### 为什么需要 React Hooks

* 告别难以理解的 Class
  * this：使用 bind / 箭头函数，实践层面的约束解决设计层面的问题
  * 生命周期
    * 学习成本
    * 不合理的逻辑规划方式
* 解决业务逻辑难以拆分的问题
  * Class 相关逻辑分散在各个生命周期函数中
  * Hooks 可以按逻辑关联拆分进不同函数组件，实现业务逻辑聚合
* 使状态逻辑复用变得简单可行
  * 原先使用 HOC, Render Props，复用状态逻辑，易造成嵌套地域
  * 可自定义 Hooks, 实现逻辑复用
* 函数组件从设计思想上看和 React 更契合：UI=render(data)

> 局限：
>
> 1. 不能完全具有类组件的能力：如 getSnapshotBeforeUpdate、componentDidCatch 这些生命周期
> 2. 业务逻辑的拆分和组织较难把握
> 3. 严格的规则约束

## 三、拓展

### React Element中的 $$typeof

[Why Do React Elements Have a $$typeof Property?](https://overreacted.io/why-do-react-elements-have-typeof-property/)

* 为防止受XSS跨站脚本攻击
*  Symbols 通用于 iframes 和 workers 等环境中，且JSON不支持 Symbol 类型

* React 会检测  `element.$$typeof`，如果元素丢失或者无效，会拒绝处理该元素

### 废弃ComponentWillXxxx

> 配合Fiber架构，带来的异步渲染机制

* Fiber架构下，render阶段是允许暂停，终止，重启的，这里的重启为**重复执行一遍整个任务**  => 该阶段的生命周期可能被重复执行
* Fiber架构下，在异步渲染的机制中，对这些生命周期函数的**滥用**会导致问题，如在某个中发起请求，在重启多次后，会导致多次请求，可能影响结果 => 推行具有强制性的最佳实践，getDerivedStateFromProps， getSnapshotBeforeUpdate

* 可被其他生命周期替代

### 数据沟通

* 父传子：父组件将state通过props传给子组件
* 子传父：父组件传给子组件一绑定自身上下文的函数,子组件在调用时传参
* 发布—订阅模式：EventEmitter