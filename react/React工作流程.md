# React 工作流程

## 一. 理念

设计理念：快速响应

主要障碍：CPU / IO 的瓶颈

解决办法：异步可中断的更新

### 1. React15 架构

- 主要可分为两层

  Reconciler（协调器）—— 负责找出变化的组件 —— Stack Reconciler

  Renderer（渲染器）—— 负责将变化的组件渲染到页面上

- 同步更新，不支持异步更新；Reconciler，Renderer交替工作

- 在Reconciler中，`mount`的组件会调用[mountComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，`update`的组件会调用[updateComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法都会递归更新子组件；数据保存在**递归调用栈**

- 由于递归执行，所以更新一旦开始，中途就无法中断，如发生中断，用户会看到**更新不完全**的DOM。当层级很深时，递归更新时间超过了 16 ms（主流浏览器刷新频率 60 Hz），用户交互就会卡顿。

### 2. React16 架构

> 我们在 React 中做的就是践行代数效应。

- 主要可分为三层

  Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**

  Reconciler（协调器）—— 负责找出变化的组件 —— Fiber Reconciler

  Renderer（渲染器）—— 负责将变化的组件渲染到页面上

- 未使用部分浏览器已实现的API，`requestIdleCallback`的原因：

  浏览器兼容性；触发频率不稳定

- 支持异步更新；Reconciler结束后，再交给Renderer

- Reconciler，可中断循环，为虚拟DOM打上标记，基于Fiber节点实现；Renderer根据标记，同步执行相应操作

### 3. Fiber 架构

**心智模型**

`异步可中断更新`可以理解为：`更新`在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态 => 代数效应

React 未采用 Coroutine（协程） 中已有的实现 Generator 是因为：

* Generator 与 async/await 类似，具有传染性，会影响调用链上的其他函数 => 增加心智负担
* Generator 的中间状态上下文关联，不好处理优先级 => 提高复杂度
* 而设计 Fiber 主要是为 ① 更新可中断，并可继续 ② **更新拥有优先级，高优先级可打断低优先级**

`React Fiber`可以理解为：`React`内部实现的一套状态更新机制。支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的`中间状态`。

[react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)

**含义**

1. **作为架构**来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。
2. 作为静态的**数据结构**来说，每个`Fiber节点`对应一个 **`React element`**，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的**工作单元**来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

**双缓存机制**

* 为防止出现白屏

* 在内存中构建新的 Fiber 树并直接替换当前的 Fiber 树
* React 中最多同时存在两棵 Fiber 树，`current Fiber`对应当前屏幕显示内容，`workInProgress Fiber`对应正在内存构建的 Fiber 树

## 二、render 阶段

> 发生在协调器 reconciler 中
>
> 从`rootFiber`开始向下深度优先遍历

### 1. 总体过程

* “递”阶段 —— [beginWork方法 (opens new window)](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3058) 

  该方法会根据传入的`Fiber节点`创建`子Fiber节点`，并将这两个`Fiber节点`连接起来。

  当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

* “归”阶段 —— [completeWork (opens new window)](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L652)

  当某个`Fiber节点`执行完`completeWork`，如果其存在`兄弟Fiber节点`（即`fiber.sibling !== null`），会进入其`兄弟Fiber`的“递”阶段。

  如果不存在`兄弟Fiber`，会进入`父级Fiber`的“归”阶段。

* 针对只有单一文本子节点的`Fiber`，`React`会[特殊处理](https://github.com/facebook/react/blob/ee432635724d5a50301448016caa137ac3c0a7a2/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L1236)，直接调用 completeWork

![递归过程示例](https://react.iamkasong.com/img/fiber.png)

### 2. beignWork

- `mount`时：除`fiberRootNode`以外，`current === null`。会根据`fiber.tag`不同，创建不同类型的`子Fiber节点`
- `update`时：如果`current`存在，在满足一定条件时可以复用`current`节点，这样就能克隆`current.child`作为`workInProgress.child`，而不需要新建`workInProgress.child`。

## 三、commit 阶段

