# Webpack

[深入浅出 Webpack   5-1 工作原理概括](http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-1%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E6%A6%82%E6%8B%AC.html)

[常见的构建工具及对比](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/1-2%E5%B8%B8%E8%A7%81%E7%9A%84%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7%E5%8F%8A%E5%AF%B9%E6%AF%94.html)

[当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992)

[老胡的整理笔记](https://hytonightyx.github.io/fedoc/06-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/webpack%20%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html)



> Webpack 是一个打包模块化 JavaScript 的工具
>
> 通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件
>
> 只能用于采用模块化开发的项目
>
> 它会从 `main.js` (默认)出发，识别出源码中的模块化导入语句， 递归的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。
>
>  从 Webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持。



## 作用

**模块打包**。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

**编译兼容**。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过`webpack`的`Loader`机制，不仅仅可以帮助我们对代码做`polyfill`，还可以编译转换诸如`.less, .vue, .jsx`这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

**能力扩展**。通过`webpack`的`Plugin`机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。



## 基本概念

在了解 Webpack 原理前，需要掌握以下几个核心概念，以方便后面的理解：

- **Entry**：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- **Module**：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- **Chunk**：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- **Loader**：模块转换器，用于把模块原内容按照需求转换成新内容。
- **Plugin**：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。



三种哈希：

* hash：跟整个项目的构建相关，构建生成的文件hash值都是一样的，只要项目里有文件更改，整个项目构建的hash值都会更改。

* chunkhash：根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的hash值。

* contenthash：由文件内容产生的hash值，内容不同产生的contenthash值也不一样



## 流程概括

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，**加载所有配置的插件**，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 **Loader** 对模块进行**翻译**，再找出该模块依赖的模块，再**递归**本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 **Chunk**，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在**特定的时间点广播出特定的事件**，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。



## 流程细节

Webpack 的构建流程可以分为以下三大阶段：

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，流程将变为如下：

![图5-1-1 监听模式的构建流程](https://tva1.sinaimg.cn/large/0082zybply1gc76m5d1ryj30h70b6ta2.jpg)

在每个大阶段中又会发生很多事件，Webpack 会把这些事件广播出来供给 Plugin 使用，下面来一一介绍。

### 初始化阶段

| 事件名          | 解释                                                         |
| --------------- | ------------------------------------------------------------ |
| 初始化参数      | 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。 这个过程中还会执行配置文件中的插件实例化语句 `new Plugin()`。 |
| 实例化 Compiler | 用上一步得到的参数初始化 Compiler 实例，Compiler 负责文件监听和启动编译。Compiler 实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例。 |
| 加载插件        | 依次调用插件的 apply 方法，让插件可以监听后续的所有事件节点。同时给插件传入 compiler 实例的引用，以方便插件通过 compiler 调用 Webpack 提供的 API。 |
| environment     | 开始应用 Node.js 风格的文件系统到 compiler 对象，以方便后续的文件寻找和读取。 |
| entry-option    | 读取配置的 Entrys，为每个 Entry 实例化一个对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备。 |
| after-plugins   | 调用完所有内置的和配置的插件的 apply 方法。                  |
| after-resolvers | 根据配置初始化完 resolver，resolver 负责在文件系统中寻找指定路径的文件。 |

### 编译阶段

| 事件名        | 解释                                                         |
| ------------- | ------------------------------------------------------------ |
| run           | 启动一次新的编译。                                           |
| watch-run     | 和 run 类似，区别在于它是在监听模式下启动的编译，在这个事件中可以获取到是哪些文件发生了变化导致重新启动一次新的编译。 |
| compile       | 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上 compiler 对象。 |
| compilation   | 当 Webpack 以开发模式运行时，每当检测到文件变化，一次新的 Compilation 将被创建。一个 Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation 对象也提供了很多事件回调供插件做扩展。 |
| make          | 一个新的 Compilation 创建完毕，即将从 Entry 开始读取文件，根据文件类型和配置的 Loader 对文件进行编译，编译完后再找出该文件依赖的文件，递归的编译和解析。 |
| after-compile | 一次 Compilation 执行完成。                                  |
| invalid       | 当遇到文件不存在、文件编译错误等异常时会触发该事件，该事件不会导致 Webpack 退出。 |

在编译阶段中，最重要的要数 compilation 事件了，因为在 compilation 阶段调用了 Loader 完成了每个模块的转换操作，在 compilation 阶段又包括很多小的事件，它们分别是：

| 事件名               | 解释                                                         |
| -------------------- | ------------------------------------------------------------ |
| build-module         | 使用对应的 Loader 去转换一个模块。                           |
| normal-module-loader | 在用 Loader 对一个模块转换完后，使用 acorn 解析转换后的内容，输出对应的抽象语法树（AST），以方便 Webpack 后面对代码的分析。 |
| program              | 从配置的入口模块开始，分析其 AST，当遇到 `require` 等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系。 |
| seal                 | 所有模块及其依赖的模块都通过 Loader 转换完成后，根据依赖关系开始生成 Chunk。 |

### 输出阶段

| 事件名      | 解释                                                         |
| ----------- | ------------------------------------------------------------ |
| should-emit | 所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。 |
| emit        | 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。 |
| after-emit  | 文件输出完毕。                                               |
| done        | 成功完成一次完成的编译和输出流程。                           |
| failed      | 如果在编译和输出流程中遇到异常导致 Webpack 退出时，就会直接跳转到本步骤，插件可以在本事件中获取到具体的错误原因。 |

在输出阶段已经得到了各个模块经过转换后的结果和其依赖关系，并且把相关模块组合在一起形成一个个 Chunk。 在输出阶段会根据 Chunk 的类型，使用对应的模版生成最终要要输出的文件内容。

## 优化

### 缩小文件搜索范围

* 使用 Loader 时可以通过 `test` 、 `include` 、 `exclude` 三个配置项来命中 Loader 要应用规则的文件，提高命中率，减少被 loader 处理的文件数量

* 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤

  ```
  module.exports = {
    resolve: {
      // 其中 __dirname 表示当前工作目录，也就是项目根目录
      modules: [path.resolve(__dirname, 'node_modules')]
    },
  };
  ```

* 配置后缀列表 `resolve.extensions` 时，尽可能要小，频率高的后缀放前，源码中尽量带上后缀，可避免寻找过程

### 使用 HappyPack

运行在 Node.js 之上的 Webpack 是单线程模型的

HappyPack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程

### 使用 Tree Shaking

Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。

它依赖静态的 **ES6 模块化**语法，例如通过 `import` 和 `export` 导入导出

需要修改 `.babelrc` 文件，关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法

需要在启动 Webpack 时带上 `--optimize-minimize` 参数，或使用 `UglifyJS`

否则知识标注出哪些未使用，未被剔除

第三方库可能采用的 CommonJS 语法，可以修改文件寻找规则

```
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
};
```

### 提取公共代码

> 提取公共代码和异步加载本质上都是代码分割

一般采用以下原则：

- 根据你网站所使用的技术栈，找出网站所有页面都需要用到的基础库，以采用 React 技术栈的网站为例，所有页面都会依赖 react、react-dom 等库，把它们提取到一个单独的文件。 一般把这个文件叫做 `base.js`，因为它包含所有网页的基础运行环境；
- 在剔除了各个页面中被 `base.js` 包含的部分代码外，再找出所有页面都依赖的公共部分的代码提取出来放到 `common.js` 中去。
- 再为每个网页都生成一个单独的文件，这个文件中不再包含 `base.js` 和 `common.js` 中包含的部分，而只包含各个页面单独需要的部分代码。

### 按需加载

> 所谓按需加载，根本上就是在正确的时机去触发相应的回调。
>
> `antd` 默认支持基于 ES modules 的 tree shaking

一般采用以下原则：

- 把整个网站划分成一个个小功能，再按照每个功能的相关程度把它们分成几类。
- 把每一类合并为一个 Chunk，按需加载对应的 Chunk
- 对于用户首次打开你的网站时需要看到的画面所对应的功能，不要对它们做按需加载，而是放到执行入口所在的 Chunk 中，以降低用户能感知的网页加载时间
- 对于个别依赖大量代码的功能点，例如依赖 Chart.js 去画图表、依赖 flv.js 去播放视频的功能点，可再对其进行按需加载

### 代码分割

[webpack - splitChunks](https://www.webpackjs.com/plugins/split-chunks-plugin/)

静态分割：代码中明确声明需要异步加载的代码，如借助 react-loadable 

* 使用较大的库或框架，但初始化时不需要使用
* 使用后就会被销毁的临时资源，如模态框，对话框
* 路由，只提供当前页面相关资源

动态分割：根据当前状态，动态地异步加载对应的代码

* 加载主题

可以借 Webpack 的注释，获取更多对分割后 chunk 的控制权

* `webpackChunkName`
* `webpackMode: lazy`：使所有异步模块都会被单独抽离成单一的 chunk
* `webpackMode: lazy-once`：将所有带有标记的异步加载模块放在同一个 chunk 中
* `webpackPrefetch: true`：预加载

### 自动插入 loading

使用 `html-webpack-plugin`

```
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

// 读取写好的 loading 态的 html 和 css
var loading = {
    html: fs.readFileSync(path.join(__dirname, './loading.html')),
    css: '<style>' + fs.readFileSync(path.join(__dirname, './loading.css')) + '</style>'
}

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'xxxx.html',
      template: 'template.html',
      loading: loading
    })
  ]
};

```

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <%= htmlWebpackPlugin.options.loading.css %>
    </head>

    <body>
        <div id="root">
            <%= htmlWebpackPlugin.options.loading.html %>
        </div>
    </body>
</html>

```

### 压缩代码

- JavaScript：UglifyPlugin

  分析 JavaScript 代码语法树，理解代码含义，从而能做到诸如去掉无效代码、去掉日志输出代码、缩短变量名等优化

  此处还涉及压缩 ES6，看[原文](http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-8%E5%8E%8B%E7%BC%A9%E4%BB%A3%E7%A0%81.html)吧

  ```
  const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
  
  module.exports = {
    plugins: [
      // 压缩输出的 JS 代码
      new UglifyJSPlugin({
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        }
      }),
    ],
  };
  ```

- CSS ：MiniCssExtractPlugin

- HTML：HtmlWebpackPlugin