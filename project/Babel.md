# Babel

[解剖Babel —— 向前端架构师迈出一小步](https://zhuanlan.zhihu.com/p/352878760)

[【第2247期】99% 开发者没弄明白的 babel 知识](https://mp.weixin.qq.com/s/sJMydobsSxzxj2SECwcr_A)

[Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)



### 是什么

> Babel 是一个 JavaScript 编译器

编译过程分为三个阶段：

> babel-core

1. **解析**：将代码字符串解析成抽象语法树（babel-parser）
   1. **分词**：将整个代码字符串分割成 *语法单元* （空白，注释，字符串，数字，标识符，运算符，括号）数组
   2. **语义分析**：在分词结果的基础之上分析 *语法单元之间的关系*
2. **变换**：对抽象语法树进行变换操作（presets 和 plugins）
3. **再建**：根据变换后的抽象语法树再生成代码字符串（babel-generator）

![图例](https://pic1.zhimg.com/80/v2-6aa5f44fc708540ab9633198ed2bb27c_720w.jpg)

常用于：

- `polyfill`
- `DSL`转换（比如解析`JSX`）
- 语法转换（比如将高级语法解析为当前可用的实现）



### 常见包的作用

#### @babel/preset-env

> @babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!

转换 JavaScript 最新的 Syntax（指的是 const let ... 等）， 而作为可选项 preset-env 也可以转换 JavaScript 最新的 API （指的是比如 数组最新的方法 filter 、includes，Promise 等等）

使用 preset-env 注入的 polyfill 是会污染全局的



#### @babel/plugin-transform-runtime

> The transform-runtime transformer plugin does three things:
>
> Automatically requires @babel/runtime/regenerator when you use generators/async functions (toggleable with the regenerator option).
>
> Can use core-js for helpers if necessary instead of assuming it will be polyfilled by the user (toggleable with the corejs option) Automatically removes the inline Babel helpers and uses the module @babel/runtime/helpers instead (toggleable with the helpers option).

polyfill 将会采用不污染全局的，且 preset-env 中的 targets 设置将会失效