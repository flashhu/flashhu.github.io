# React

### 1. 虚拟 DOM

**是什么**

虚拟 DOM 是对真实 DOM 的描述，是一个 JS 对象

**为什么出现**

> 交互少，原生JS => 交互变多，jQuery 对 DOM API封装
>
> =数据驱动=> DOM操作量大，模板引擎方案，早期为整体注销再渲染 => 虚拟DOM

1. 主要目的不是为提高性能，而是为提高研发效率及体验：

   ①**数据驱动视图**，基于函数式 UI 实现声明式编程

   ②实现**跨平台**，一套虚拟DOM对接不同平台的具体逻辑（如 react 的 renderer 对应的包根据平台的不同可以有多种选择）

2. 该种方案**并不一定能带来最好的性能**，只是相对不错

   > 虚拟 DOM 的劣势主要在于 JS 计算的耗时，而 DOM 操作的能耗和 JS 计算的能耗根本不在一个量级

   ① 性能问题影响因素多，虚拟 DOM 在更新了大部分真实DOM时，表现不一定比其他方案好

   ②批量更新：缓冲每次生成的补丁集，它会把收集到的多个补丁集暂存到队列中，再将最终的结果交给渲染函数，最终实现集中化的 DOM 批量更新。避免刚更新完，又触发渲染，造成无效的渲染流程

**在 React 中的工作流程**

* 挂载阶段

  React 结合 JSX 的描述，构建出虚拟 DOM 树

  通过 ReactDOM.render 实现虚拟 DOM 到真实 DOM 的映射（触发渲染流水线）；

* 更新阶段

  > "差量更新"

  页面的变化在作用于真实 DOM 之前，会先作用于虚拟 DOM

  虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM

* 在 React  Element 中还带有 **`$$typeof`** 属性，主要是为了**防范 XSS 攻击**。

  属性值使用 Symbol 类型，在 iframe，workers 中也能使用，同时不能再 JSON 中使用。React 会检查元素是否有该属性，如没有则不会处理



### 2. JSX

[深入 JSX](https://react.html.cn/docs/jsx-in-depth.html)

**是什么**

JSX 是 JavaScript 的一种语法扩展（就是 JS，所以具有 JS 的能力）

JSX 是 React.createElement 的语法糖

会生成对应的 React Element，也就是常说的虚拟 DOM

**为什么**

* 语法类似于 HTML，学习成本低（Vue 中模板的方式会需要引入较多新的概念）
* 声明式，可读性更强

**注意点**

* 自定义组件开头必须为大写
* props 不传值，默认为`true`；此处与 ES6 中的对象简写不同，与 HTML 中标签属性的行为相同
* 布尔值（`true`，`false`），`null`，`undefined` 是有效子元素，但不会被渲染
* **数值 0 依然会被渲染**

**新变化**

React 16 会把 JSX 转换为 `React.createElement(...)` 调用，因此写了 JSX 的地方就必须显式引入 React

React 17 中可以无需引入 React 使用 JSX，在编译器如 Babel 中会引入 react 提供的新入口 `jsx`

```
// 由编译器引入（禁止自己引入！）
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```



### 3. 函数组件和类组件比较

**是什么**

- 类组件，基于ES6 Class的写法
- 函数组件，函数形态存在；没有出现Hooks时，内部无法定义和维护state

**相同**

都能接受属性，并构造对应的 React 元素

**不同**

- 类组件基于面向对象的思想，函数组件体现了函数式编程的思想

- 类组件需要**继承** `React.Component`，函数组件不需要；

- 类组件可以访问**生命周期**方法，函数组件不能，但可以借助 hooks 实现部分等效操作；

- 类组件中可以获取到**实例化**后的 this，而函数组件不可以；

- 类组件捕获了**最新的值**，可通过提前保存值再显式传递，render() 使用写闭包取到渲染所使用的值（React中props, state不可变）

  函数组件捕获了**当次**渲染所使用的值( props/state )，可通过设置ref 取到最新值

- 类组件中使用 `React.PureComponent` 实现浅比较 prop 和 state

  函数组件中使用 `React.memo` 实现浅比较 props，当包含 `useState`，`useContext` 时，如发生变化还是会重新渲染



### 3. 生命周期

分成三个阶段来看，分别为：

**挂载时**：(4 + 1)

* **`constructor`**

* `getDerivedStateFromProps(props, state)`（静态方法）

  返回一个对象来更新 state，如果返回 null 则不更新任何内容

* `UNSAFE_componentWillMount`

* `render`

* **`componentDidMount`**

**更新时**：(5 + 2)

> 三种触发方式：new props，setState，forceUpdate

- `UNSAFE_componentWillReceiveProps`（**在父组件重新渲染时触发**）

- `getDerivedStateFromProps`（v16.3 中为 props 触发，v16.4 中变为都会触发）

- `shouldComponentUpdate`（前两种）

- `UNSAFE_componentWillUpdate`

- `render`

- `getSnapshotBeforeUpdate`

  使得组件能在发生更改之前从 DOM 中捕获一些信息

  返回值将作为参数传递给 `componentDidUpdate()`

- **`componentDidUpdate`**

**卸载时：**(1)

* **`componentWillUnmount`**

**总结：**

常用的有四个：

* `constructor`：初始化 state；为事件处理函数绑定实例 `this`
* ``componentDidMount`：通常在此处发起请求获取数据
* `componentDidUpdate`：发起请求获取数据，但要注意包裹判断条件，防止死循环
* `componentWillUnmount`：取消事件监听，清除定时器等

**废弃 componentWillXXX 的原因**

废弃 `componentWillMount`，`componentWillReceiveProps`，`componentWillUpdate` 主要是**为了配合 Fiber 架构带来的异步渲染机制**

* Fiber架构下，render阶段是允许暂停，终止，重启的。这三个生命周期函数可能被**重复执行**
* Fiber架构下，在异步渲染的机制中，原有对这些生命周期函数的**滥用**会导致问题，如在某个中发起请求，在重启多次后，会导致多次请求，可能影响结果
* 操作可转移到其他生命周期完成



### 4. 组件通信

- 父传子：父组件将state通过props传给子组件
- 子传父：父组件传给子组件一绑定自身上下文的函数,子组件在调用时传参
- 兄弟间：子传父，再父传子
- 发布—订阅模式：EventEmitter



### 5. Hooks

[hooks - 官方文档](https://react.docschina.org/docs/hooks-intro.html)

[React Hooks 万字总结](https://juejin.cn/post/6948748617817522206)

> v16.8 开始

> 函数组件每次渲染结束之后，内部的变量都会被释放，重新渲染时所有的变量会被**重新初始化**！！

**是什么**

Hooks 可以让我们在函数组件中使用 state 等特性

它存在两个限制规则：

* **只能在函数最外层使用**，不能再循环，条件判断或子函数中使用。这是因为 Hooks 的底层依赖**顺序链表**，根据调用顺序来判断对应关系，所以必须保证每次的执行顺序一致，否则渲染结果将不可控
* 只能在 **React 的函数组件**中使用 Hook，或者在自定义 Hook 中

**为什么**

- 类组件中会将**逻辑分散**在各个**生命周期函数中**；而 Hooks 中可以**按逻辑关联拆分到更小的函数**，业务逻辑更聚合
- 类组件之间难以**重用有状态逻辑**，只能借助 **HOC，Render Props** ，但容易造成嵌套地狱；Hooks 中可以通过**自定义 Hooks** 的方式，实现逻辑复用
-  类组件使用 **class**，由此带来一些问题，如不得不学习 `this`  的工作方式（需要构造函数内绑定或使用箭头函数），不能很好地被打包工具压缩，且较难优化
- 函数组件更符合 React 的**设计思想**： UI = render(state) ，根据状态渲染出视图

**局限性**

* 目前没有完全覆盖 class 的所有使用场景，如不太常用的 `getSnapshotBeforeUpdate`，`getDerivedStateFromError` 和 `componentDidCatch` 生命周期

**常用 hooks**

1. `useState`

   等效于类组件中的 `setState`，使用时形如：

   ```javascript
   const [name, setName] = useState('rose')
   ```

   括号中传入的初始值只有在第一次渲染时会用到

2. `useEffect`

   > 捕捉当前 state，如涉及异步/定时器，并不会取到最新值

   可以等效于类组件中 `componentDidMount`，`componentDidUpdate`，`componentWillUnmount` 

   ```javascript
   useEffect(()=>{
       ...
   })
   ```

   当不传入第二个参数时，每次渲染都会执行；当第二个参数为空数组时，表示首次渲染时执行；当第二个参数为非空数组时，则当数组中的值发生改变时就会执行

   首个参数传入的函数中，可以返回一函数，在组件卸载时会执行

3. `useContext`

   hook 的方式使用 context，相当于原有的 `<MyContext.Consumer>` 使用时形如：

   ```
   const value = useContext(MyContext);
   ```

   接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。在组件中使用后， context 值变化会引起重新渲染。

   上层依然需要使用 `<MyContext.Provider>` 提供 context。

4. `useRef`

   可以用于获取最新值，或和 dom 相结合

   返回的 ref 对象在组件的整个生命周期内保持不变，类似于在函数外定义一全局变量

   ```
   const refContainer = useRef(initialValue);
   ```

5. `useMemo`

   > 性能优化必备

   函数组件更新后，变量会重新被赋值，因此容易造成无效的渲染

   主要用于缓存值，使用方式形如：

   ```javascript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   ```

6. `useCallback`

   > 性能优化必备

   与上文相似，主要用于函数缓存，使用方式形如：

   ```javascript
   const memoizedCallback = useCallback(
     () => {
       doSomething(a, b);
     },
     [a, b],
   );
   ```

7. `useReducer`

   适合用于 state 较逻辑复杂的情况，工作方式类似于 redux 中的 reducer

   ```javascript
   const [state, dispatch] = useReducer(reducer, initialArg, init);
   ```

8. 自定义 hook

   以获取旧的 props 或 state 为例

   ```javascript
   function Counter() {
     const [count, setCount] = useState(0);
     const prevCount = usePrevious(count);
     return <h1>Now: {count}, before: {prevCount}</h1>;
   }
   
   function usePrevious(value) {
     const ref = useRef();
     useEffect(() => {
       ref.current = value;
     });
     return ref.current;
   }
   ```

   

### 6. setState

出于性能考虑，React 可能会把多个 `setState()` **调用合并**成一个调用，也就是“批量更新”，状态会按顺序做浅合并

因此 `this.props` 和 `this.state` 可能会**异步更新**，不能作为更新下一个状态的依赖

```
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

在 React 16 中，被 `setTimeout`包裹的`this.setState`可以在当前调用栈获取到更新后的`state`，这主要是基于内部的实现：

* 事件回调会被包裹在`batchedUpdates`函数中执行
* `setTimeout`包裹后，在执行`this.setState`时能逃脱原有执行批处理操作的判断条件，因此才发生了“同步”的现象

在 React 17 中，已经被`lane`优先级模型替代，不会再有此问题



### 7. fiber

**是什么**

`React`内部实现的一套**状态更新机制**，支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的中间状态。

1. 作为架构

   React 16 中的协调器正是基于 Fiber 实现

2. 作为数据结构

   每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息

3. 作为工作单元

   每个**任务更新单元**为 `React Element` 对应的`Fiber节点`，节点中包含本次更新中组件改变的状态，需要执行的工作

**为什么**

1. 由同步更新变为异步更新

   React 15 中的协调器（Reconciler）采用递归的方式，为栈调和

   更新一旦开始，中途就无法中断，如发生中断，用户会看到**更新不完全**的DOM

   当层级很深时，递归更新时间超过了 16 ms（主流浏览器刷新频率 60 Hz），用户交互就会卡顿

2. 可中断更新，恢复之前执行的中间状态

   > 代数效应

   涉及高优先级任务插队的情况，且由于 `Generator` 具有**传染性**（上下文都需要进行修改），**中间状态与上下文的关联性**的特点，没有使用 `Generator`，而使用了 `fiber`

**怎么做**

1. 结构

   * 表示虚拟 DOM

     ```javascript
     // Fiber对应组件的类型 Function/Class/Host...
     this.tag = tag;
     // key属性
     this.key = key;
     // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
     this.elementType = null;
     // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
     this.type = null;
     // Fiber对应的真实DOM节点
     this.stateNode = null;
     ```

   * 构成 fiber 树

     return，child，sibling

   * 更新造成的状态改变相关信息

     ```javascript
     this.pendingProps = pendingProps;
     this.memoizedProps = null;
     ```

   * 优先级

     ```javascript
     this.lanes = NoLanes;
     this.childLanes = NoLanes;
     ```

   * 另一次更新对应的 fiber

     current 指向 workInProgress，workInProgress 指向 current

     ```javascript
     this.alternate = null;
     ```

2. 双缓存机制
   - 为防止出现白屏
   - 在内存中构建新的 Fiber 树并直接替换当前的 Fiber 树
   - React 中最多同时存在两棵 Fiber 树，`current Fiber`对应当前屏幕显示内容，`workInProgress Fiber`对应正在内存构建的 Fiber 树



### 8. diff

**是什么**

用于实现增量更新

对比 <u>current Fiber</u> 和 当次渲染传入的 <u>JSX 对象</u>，生成 <u>workInProgress Fiber</u>

**为什么设定了限制条件**

两棵树完全对比，时间复杂度需要 O(n^3)，开销过大

处于降低时间复杂度的考虑

**限制**

- 分层对比：放弃跨层级节点比较，**只针对相同层级界定作对比**
- 类型对比：类型不同直接重建，类型相同对比属性
- 使用 key 重用节点

**具体实现**

1. 单节点

   当**`key相同`且`type不同`**时，代表我们已经找到本次更新的`p`对应的上次的`fiber`，但是`p`与`li` `type`不同，**不能复用**。既然唯一的可能性已经不能复用，则剩下的`fiber`都没有机会了，所以**都需要标记删除**。

   当**`key不同`**时，只代表遍历到的该`fiber`不能被`p`复用，后面还有兄弟`fiber`还没有遍历到。所以**仅仅标记该`fiber`删除**

2. 多节点

   > 三种情况：节点更新，节点增删，节点变序
   >
   > 结合实际更常用更新，所以优先判断更新

   * 处理更新
   * 处理非更新



### 9. 性能优化

> Pure Component 和 memo



### 10. HOC



### 11. render

[React组件到底什么时候render啊](https://juejin.cn/post/6886766652667461646)

`React`创建`Fiber树`时，每个组件对应的`fiber`都是通过如下两个逻辑之一创建的：

- render。即调用`render`函数，根据返回的`JSX`创建新的`fiber`。
- bailout。即满足一定条件时，`React`判断该组件在更新前后没有发生变化，则复用该组件在上一次更新的`fiber`作为本次更新的`fiber`。

当命中`bailout`逻辑时，就不会调用`render`函数

`bailout` 的判断条件为：

* workInProgress.type === current.type

* oldProps === newProps

* context没有变化

* !includesSomeLane(renderLanes, updateLanes)



### 12. 启发式更新算法

[React17新特性：启发式更新算法](https://juejin.cn/post/6860275004597239815)

**是什么**

启发式指的是 **通过`优先级`调度更新**

**为什么**

> 经济基础决定上层建筑

`Vue`使用`模版语法`，可以在编译时对确定的模版作出优化。

而`React`纯`JS`写法太过灵活，使他在`编译时优化`方面先天不足。

所以，`React`的优化主要在`运行时`

**怎么做**

1. React15 

   同步更新，导致虽然使用了批量更新，但出现耗时操作时，依然会卡顿

2. React16

   Fiber Reconciler 架构实现异步可中断更新，<u>启发式更新算法</u>即为控制其工作的算法。

   采用 `expirationTimes模型`，离过期时间越近，优先级越高，当过期时，优先级置为最高。

3. React17

   采用 `lane` 优先级模型，可以选定一个连续的`优先级区间`，借助多位二进制实现，能动态的向`区间`中增减`优先级`，可以处理更细粒度的更新。

   

   

