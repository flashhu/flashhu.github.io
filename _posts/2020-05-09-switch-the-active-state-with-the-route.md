---
layout:     post
title:      "如何实现导航选中状态随路由变化"
subtitle:   "越写越不会 越不会越写"
date:       2020-05-09 22:19:28
author:     "虎鲸"
header-img: "img/post-bg-html-select.jpg"
tags:
    - React
---

#### 问题描述
在使用 antd 的过程中，突然发现 \<Menu> 中选中状态的元素并没有随路由变化而改变
此时相关代码如下：
```javascript
<Menu 
    theme="light" 
    mode="horizontal" 
    defaultSelectedKeys={USER_MENU_LIST[0].name}
>
    {this.currUser.type && ADMIN_MENU_LIST.map((item) =>
        <Menu.Item key={item.path}>
            <NavLink to={item.path}>
                <span>{item.name}</span>
            </NavLink>
        </Menu.Item>
    )}
</Menu>
```
***
#### 解决办法
搜寻已有的 [issue](https://github.com/vueComponent/ant-design-vue/issues/515)，其中的链接已失效，其中的建议并没有成功解决笔者的问题
网络上查找相关文章，提到的主要关键字有：`history`， `withRouter`，`selectedKeys` 
逐点击破
- `selectedKeys` 
  其为 antd 提供的API，用于修改当前选中的元素
- `withRouter`
  路由组件可以直接获取`match`，`history`，`location`，非路由组件需要使用`wiithRouter`来获取
- `history`
  监听浏览器地址变化，转化为`location`  [文档传送门](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)

以下为修改后的相关代码，部分省略
①使用`wiithRouter`， 并将`selectedKeys` 设为当前`window.location.pathname`值
```javascript
...
import { withRouter } from 'react-router-dom'
...
class NavWrapper extends Component {
	const path = window.location.pathname;
...
                <Menu 
                    theme="light" 
                    mode="horizontal" 
                    defaultSelectedKeys={USER_MENU_LIST[0].name}
                    selectedKeys={[path]}
                >
                    {this.currUser.type && ADMIN_MENU_LIST.map((item) =>
                        <Menu.Item key={item.path}>
                            <NavLink to={item.path}>
                                <span>{item.name}</span>
                            </NavLink>
                        </Menu.Item>
                    )}
                </Menu>
...
}

export default withRouter(NavWrapper)
```
②使用 Router 实现自定义的 history
```javascript
...
import { Switch, Route, Router } from 'react-router-dom'
import history from './history'
...
function App() {
  return (
    <Router history={history}>
      <NavWrapper />
	  <ContentWrapper>
    	<Switch>
          <Route path='/admin' exact component={loadable(() => import('./app/admin/health'))} />
            ...
        </Switch>
      </ContentWrapper>
    </Router>
  );
}
...
```
```javascript
import { createBrowserHistory } from 'history'

export default createBrowserHistory();
```

收工！



***

#### 补充记录
当上述代码，直接通过`npm run build`打包之后，会发现通过路由显示的组件将不能正常显示
以下为解决上述情况的新写法，视需要选择  [灵感来源](https://github.com/brickspert/blog/issues/3)
①使用`wiithRouter`， 并将`selectedKeys` 设为当前`window.location.pathname`值
```javascript
...
import { withRouter } from 'react-router-dom'
...
class NavWrapper extends Component {
	const path = this.props.location.pathname;
...
                <Menu 
                    theme="light" 
                    mode="horizontal" 
                    defaultSelectedKeys={USER_MENU_LIST[0].name}
                    selectedKeys={[path]}
                >
                    {this.currUser.type && ADMIN_MENU_LIST.map((item) =>
                        <Menu.Item key={item.path}>
                            <NavLink to={item.path}>
                                <span>{item.name}</span>
                            </NavLink>
                        </Menu.Item>
                    )}
                </Menu>
...
}

export default withRouter(NavWrapper)
```
②使用 HashRouter
```javascript
...
import { Switch, Route, HashRouter as Router } from 'react-router-dom'

...
function App() {
  return (
    <Router>
      <NavWrapper />
	  <ContentWrapper>
    	<Switch>
          <Route path='/admin' exact component={loadable(() => import('./app/admin/health'))} />
            ...
        </Switch>
      </ContentWrapper>
    </Router>
  );
}
...
```
```javascript
import { createHashHistory } from 'history';

export default createHashHistory();
```