# Node.js

[狼书（卷2）]()

### 1. Koa1 和 Koa2 区别

核心 API 基本无差异

* Koa v1 基于 ES6 的 Generator；Koa v2 基于 async/await

* Koa v1 使用隐式 this 作为上下文；Koa v2 使用显式的 ctx 作为上下文

  > 为什么新增 ctx ?
  >
  > 使用 async + 箭头函数的形式后，this 指向容易出现问题

* Koa v1 对外导出的是函数（和 express 相似）；Koa v2 对外导出的是类，需要使用 new 进行实例化

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  ```

  ```javascript
  const express = require('express');
  const app = express();
  ```

  



### 2. Koa v2 和 Express 区别

[多维度分析 Express、Koa 之间的区别](https://zhuanlan.zhihu.com/p/115339314)

[再也不怕面试官问你express和koa的区别了](https://zhuanlan.zhihu.com/p/87079561)

> 两个都是对原有 http 模块的封装
>
> Express 为 HTTP 服务器提供小的，健壮的工具，使之成为开箱即用的 Web 框架
>
> Koa 只提供中间件内核

|                  |    koa(Router = require('koa-router'))     |          express(假设不使用app.get之类的方法)           |
| :--------------: | :----------------------------------------: | :-----------------------------------------------------: |
|      初始化      |           const app = new koa()            |                  const app = express()                  |
|    实例化路由    |          const router = Router()           |             const router = express.Router()             |
| app级别的中间件  |                  app.use                   |                         app.use                         |
| 路由级别的中间件 |                 router.get                 |                       router.get                        |
|  路由中间件挂载  |          app.use(router.routes())          |                  app.use('/', router)                   |
|     监听端口     |              app.listen(3000)              |                    app.listen(3000)                     |
|     使用示例     | router.post('/newCard', (req, res) => {}） | router.post('/save', new Auth(9).m, async (ctx) => {}） |

* **handler 处理方式**

  Express 使用**回调函数**实现异步，错误处理没办法借助 `try catch` 捕获，也需要借助回调进行处理，容易出现回调地狱；

  Koa 使用 **async** 函数做异步控制，可以借助 `try catch` 进行错误捕获；

* **内置中间件**

  Express 中内置路由、视图等基础中间件，可以直接使用，更方便；

  Koa 中只提供了中间件内核，需要手动集成基础中间件（`koa-router`，`koa-views`，`koa-safe-jsonp`），但也因此更轻量

  ```javascript
  const express = require('express');
  const router = express.Router();
  ```

  ```javascript
  const Router = require('koa-router')
  const router = new Router()
  ```

* **中间件执行机制**

  Express 中间件是<u>基于回调函数</u>同步的，**不会等中间件中的异步操作完成，线型**，只能捕获**单向**请求流；

  Koa 中间件借助 async / await **可以等待异步操作完成**，使用**洋葱模型**（compose），通过 `await next()` 控制调用 “下游” 中间件，直到 “下游” 没有中间件且堆栈执行完毕，最终在流回 “上游” 中间件（常在中间件中做错误捕获），可以**双向**拦截，在一个中间件中同时对请求，响应进行拦截；

* **响应机制**

  Express 的数据响应直接操作 **`res` 对象**，使用 `res.send()`  后会**立即响应**

  Koa 的数据响应借助 **`ctx.body` 设**置，在所有中间件结束后，才会响应，**存在操作空间**

  

### 3. http 模块

> 使用 HTTP 服务器和客户端

[文档](http://nodejs.cn/api/http.html)