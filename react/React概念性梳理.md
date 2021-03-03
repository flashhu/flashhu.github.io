# React概念性梳理

## 零. 数据流通

### Context

[doc](https://zh-hans.reactjs.org/docs/context.html#gatsby-focus-wrapper)

> 为了共享那些对于一个组件树而言是“全局”的数据
>
> Cosumer 不仅能够读取到 Provider 下发的数据，还能读取到这些**数据后续的更新** 

* 新旧变化
  * [过时的Context](https://zh-hans.reactjs.org/docs/legacy-context.html)  v16.3 以前
    * 生产者设置 childContextTypes 和 getChildContext
    * 消费者定义 contextTypes，通过 this.context 访问
  * 旧的API 代码区分度不高；无法保证数据同步，[与SCU有关](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)
  * 新的API：即便组件的 shouldComponentUpdate 返回 false，它仍然可以“穿透”组件继续向后代组件进行传播，进而确保了数据生产者和数据消费者之间数据的一致性

* React.createContext
  * 将 `undefined` 传递给 Provider 的 value 时，Consumer的 `defaultValue` 不会生效
* Provider
  * 一个 Provider 可以和多个消费组件有对应关系。
  * 多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据
  * value发生变化时，内部所有consumer 组件重新渲染；注意为对象时，重新渲染，被赋值为新对象，内部consumer组件触发意外渲染
  * **不受制于 `shouldComponentUpdate` **，当 consumer 组件在其祖先组件退出更新的情况下也能更新
* Consumer
  * [消费多个context](https://zh-hans.reactjs.org/docs/context.html#consuming-multiple-contexts)

### Hooks

> 函数中使用 | 不在循环，条件，嵌套中使用 => **保持执行顺序一致**

* 底层依赖顺序链表

  * 首次渲染时会调用mountState，构建链表并渲染
  * 更新阶段会调用updateState，遍历链表并渲染
  * 需要保证每次执行顺序一致，否则渲染不可控

  

### 状态管理—Redux

> Redux 是为JavaScript应用而生的，也就是说它不是 React 的专利，React 可以用，Vue 可以用，原生 JavaScript 也可以用
>
> **数据流严格单向**

* store -> view -> action -> reducer -> store
* store：单一数据源，只读
* action：type必传，使用dispatch派发
* reducer：纯函数，返回state

## 零. 设计理念

### Reconciliation

> 常被译为 协调，调和
>
> 通过如 ReactDOM 等类库使虚拟 DOM 与“真实的” DOM 同步的过程
>
> **不等于 diff**, 但 diff 在该过程中具有代表性

### diff

> 1. 两个不同类型的元素会产生出不同的树；
> 2. 开发者可以通过 `key` prop 来暗示哪些子元素在不同的渲染下能保持稳定

* 分层对比：放弃跨层级节点比较，**只针对相同层级界定作对比**
* 同类型对比
* 使用 key 重用节点

## 一. JSX -> React Element

### JSX

[doc](https://reactjs.org/docs/jsx-in-depth.html)   [@babel/plugin-transform-react-jsx原理](https://juejin.im/post/6844903715233595405#heading-3)

>  **JSX是JS的一种语法扩展**

作用：React.createElement 的语法糖

* 标签tag 对应 React.createElement参数中的type
* 一模块导出多组件，可使用点语法，如 `<Picker.Item />`
* 自定义组件必须为大写开头，否则会认为是 HTML 标签
* 运行时选择类型，需提前赋值，不能直接写在 tag 处
* 字符串字面量通过`{"&lt;3"}`赋值给 props, 不进行转义 [Babel Try it out](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeADjMAQ1QwG8AiAMgSgG4BLAE3IF8Yp6okMqaHmAfAGlCAZXABzbAHpcAoA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cenv&prettier=true&targets=&version=7.10.5&externalPlugins=)
* props 不传值，默认为`true`；此处与 ES6 中的对象简写不同，与 HTML 中标签属性的行为相同 [Babel Try it out](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAbgQwDYFcCmMC8MDkU3Q4BQoksaSaAtmmLNgDwAOMEAFiAO4xQCWUlGLwAmmAN6JUaAL4A-ANIIAyuADmDAPRNZQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=true&targets=&version=7.10.5&externalPlugins=)
* JSX 会移除行首尾的空格以及空行。与标签相邻的空行均会被删除，文本字符串之间的新行会被压缩为一个空格
* React 组件能够返回存储在数组中的一组元素 [Babel Try it out](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAogGwKYFsllgXhgCgJQyYB8MA3gFAwBOSUArlWDANqUzsA8CAlkQGLcq0GNyioOAeh5EANG04AHIvPYBIAMpJQYACYixKFexgcICgIZgiY6JLOXlxyUrnsAugG4Y5AL5A&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=true&targets=&version=7.10.5&externalPlugins=)
* `false`, `null`, `undefined`, and `true` 是合法的子元素，但它们并不会被渲染；除此之外的 falsy 值仍会被渲染，如 0

### Fiber

> 使同步渲染变成异步
>
> render阶段允许打断，0感知；commit阶段总是同步执行

**出现原因：**因 JS 线程 和 渲染线程 为互斥，当 JS线程长时间占用主线程时，会造成卡顿。栈协调为同步递归，不可打断，易造成卡顿

**定义：** 

### React.Component

[doc](https://reactjs.org/docs/react-api.html#reactcomponent)  [code](https://github.com/facebook/react/blob/f4cc45ce96/packages/react/src/ReactBaseClasses.js#L21)

* class 组件需要继承 React.Component, render必须定义

**生命周期函数**  [图例](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

* 挂载：
  * constructor；调用一次
  * getDerivedStateFromProps（v16.3）
    * 静态方法，**不依赖实例，无this**
    * 接收props,state，分别代表来自父组件的props，组件自身的state, 返回用于更新state的**对象**，键值不一样，不会覆盖，是共存
    * 非componentWillMount替代品！
    * [You Probably Don't Need Derived State](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
  * componentWillMount （V15）
  * **render**；不操作真实DOM
  * componentDidMount；真实DOM已挂载
  
* 更新：

  * componentWillReceiveProps （v15): 由父组件触发

    **易错点：**如果父组件导致组件重新渲染，即使props未发生改变，该方法也会被调用。该方法由**父组件的更新**触发，非由props触发

  * getDerivedStateFromProps

    v16.4 + 中**任何因素**都会触发更新；v16.3 中**只有父组件更新**会触发

  * shouldComponentUpdate：组件自身激发

  * componentWillUpdate：

  * render

  * getSnapshotBeforeUpdate：

    * 返回值会作为第三个参数给componentDidUpdate
    * 与 componentDidUpdate 一起，涵盖过时的 componentWillUpdate 的所有用例

  * componentDidUpdate

* 卸载

  * componentWillUnmount

### React.PureComponent

[doc](https://reactjs.org/docs/react-api.html#reactpurecomponent)  [code](https://github.com/facebook/react/blob/f4cc45ce96/packages/react/src/ReactBaseClasses.js#L131)

### React.Fragment

[doc](https://reactjs.org/docs/react-api.html#reactfragment)  [code]()

### React.createElement

[doc](https://reactjs.org/docs/react-api.html#createelement)  [code](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js#L348)

作用：创建并返回 React Element

传参：type, config, children

* type可能为普通html标签字符串，React 组件类型（class/function完整定义，[Babel Try it out](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAECCAO8DC4rQKYA8Au6B2AJjAErpjDYB0SA9gLbw177bQDeAUNNAE74HoeACgCU7Lt17psAVx55oAHngA-ANJgAykwDmigPSqJAXw6mOwJhFboQ6Oi2gBeJQmSoY-lUA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cenv&prettier=true&targets=&version=7.10.5&externalPlugins=)），React Fragment类型



## 二. React Element -> DOM node

