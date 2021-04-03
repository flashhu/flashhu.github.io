[nginx - doc](https://nginx.org/en/docs/)

[老李的 mooc](https://mooc.hznu.edu.cn/#/mooc/CLang)

[前端工程师不可不知的Nginx知识](https://juejin.cn/post/6864085814571335694)

[万字长文！一次性弄懂 Nginx 处理 HTTP 请求的 11 个阶段](https://juejin.cn/post/6844903973544001549)



它应该读成**“Engine X”**



> `nginx` 于2004年发布，聚焦于高性能，高并发和低内存消耗问题。并且具有多种web服务器功能特性： `负载均衡`，`缓存`，`访问控制`，`带宽控制`，以及高效整合各种应用的能力

> 为了更好的性能以及高效使用服务器资源，nginx采用了 `模块化`、`事件驱动`、`异步`、`单线程`、`非阻塞架构`的基本模型。nginx有一个主进程以及许多辅助进程。`内核`使用多路复用和事件通知，并且给不同的进程分配不同的任务。数量有限的工作进程 `Worker` 使用高效的单线程循环处理连接, 每个`Worker`进程每秒可以处理数千个并发连接、请求。

> 题外话：https 请求 http 会出现请求失败，根本解决办法还是全部都用上 https



## 一、概念篇

Nginx 是轻量级服务器，使用了**“进程池 + 单线程”**的工作模式

* 在启动的时候会预先创建好固定数量的 worker 进程，在之后的运行过程中不会再 fork 出新进程

* 在进程池之上，还有一个“master”进程，专门用来管理进程池

* 单线程的方式，带来的好处就是开发简单，没有互斥锁的成本，减少系统消耗

* 其处理能力归功于 **I/O 多路复用接口** —— `epoll`

  * 把多个 HTTP 请求处理打散成碎片，都“复用”到一个单线程里
  * 不按照先来后到的顺序处理，而是只当连接上真正可读、可写的时候才处理
  * 如果可能发生阻塞就立刻切换出去，处理其他的请求
  * 大量的连接管理工作都是在操作系统内核里做的，减轻了应用程序的负担

* 使用了“职责链”模式，多个模块分工合作，自由组合，以流水线的方式处理 HTTP 请求

  ![11个阶段](https://static001.geekbang.org/resource/image/41/30/41318c867fda8a536d0e3db6f9987030.png)



Nginx 的 HTTP 处理有四大类模块：

handler 模块：直接处理 HTTP 请求；

filter 模块：不直接处理请求，而是加工过滤响应报文；

upstream 模块：实现反向代理功能，转发请求到其他服务器；

balance 模块：实现反向代理时的负载均衡算法。



**处理 HTTP 请求的过程**

Nginx 启动进程，一个master，多个worker，创建epoll，

监听端口，多路复用来管理http请求，

http请求到达worker内部，通过模块流水线处理，最后返回http响应。



**以 nginx.conf 为例**

```
include /usr/share/nginx/modules/*.conf;     # 组合多个配置文件

http {                                       # http/https 配置
    ....                                     # 公共配置，对所有server都生效
    server {                                 # 每个server用于定义一个虚拟主机
        listen       80;                     # 监听端口
        server_name  localhost;              # 服务名

        location / {                         # 对url访问的资源属性
            root   html;                     # 站点根目录
            index  index.html index.htm;
        }
    ......
    }
}
```



**文件目录**

- /etc/nginx/: 默认配置文件存放目录
- /etc/nginx/nginx.conf: 默认全局配置文件(top-level)
- /etc/nginx/conf.d/: 默认 HTTP 服务器配置
- /var/log/nginx/: 日志文件



**启动/关闭服务**

```
nginx -s reload 
nginx -s quit
```



### 1. server_name 匹配规则

包含类型有：

- 多个域名: 第一个是主域名，比如 `server_name www.mooc.com, www.mooc.online`
- 泛域名: 仅支持在最前或最后，比如 `server_name www.mooc.*`
- 正则表达式: 加~前缀，比如 `server_name www.mooc.com ~^www\d+\.mooc\.tech$`

```
1. 精确匹配
2. *在前的泛域名
3. *在后的泛域名
4. 按文件顺序匹配正则表达式的域名
5. default server 
    - 第1个
    - listen指定default
```



### 2. location 匹配规则

- 先遍历所有的前缀字符串，选取最长的一个前缀字符串，如果这个字符串是 `=` 的精确匹配或 `^~` 的前缀匹配，会直接使用
- 如果第一步中没有匹配上 `=` 或 `^~`，那么会先记住最长匹配的前缀字符串 `location`
- 按照 `nginx.conf` 文件中的配置依次匹配正则表达式
- 如果所有的正则表达式都没有匹配上，那么会使用最长匹配的前缀字符串

```bash
1. 前缀字符串
    - 常规匹配
    - =：精确匹配
    - ^~：匹配上后则不再进行正则表达式匹配
2. 正则表达式
    - ~：大小写敏感的正则匹配
    - ~*：大小写不敏感
3. 用户内部跳转的命名 location: @符号
```



### 3. 常用字段名

* `root`：将 URL 映射为文件路径，以返回静态文件内容，映射完整 URL
* `proxy_pass`：设置反向代理，请求需要转发
* `return`： 直接设置重定向
* `rewrite`：可以实现重定向，但 URL 也会变
* `alias`：将 URL 映射为文件路径，以返回静态文件内容，将 location 后 URL 映射
* `index`：指定 `/` 结尾的目录访问时，返回 `index` 文件内容，先于 `autoindex` 模块执行



### 4. 常用内置变量

[变量索引 - nginx](http://nginx.org/en/docs/varindex.html)

[Nginx系列之常用内置变量](https://blog.csdn.net/chunyuan314/article/details/55056539)

**从请求行**

| 变量             | 含义                   | 示例                                         |
| ---------------- | ---------------------- | -------------------------------------------- |
| $request         | 整个请求行             | GET /nginx-var/request-line?a=1&b=2 HTTP/1.1 |
| $request_method  | 请求方法（如GET、POST) | GET                                          |
| **$request_uri** | 完整的请求URI          | /nginx-var/request-line?a=1&b=2              |
| $uri             | URI，除去查询字符串    | /nginx-var/request-line                      |
| $args            | 查询字符串             | a=1&b=2                                      |
| $query_string    | 同$args                | a=1&b=2                                      |

说明： 这些变量在配置文件中通常配合try_files指令和rewrite指令使用。
**从请求头**

| 变量                 | 含义                                                         | 示例                                                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **$host**            | 该变量按如下优先级获得：请求行中解析到的host、请求头“Host”中的host、配置文件中匹配到的server_name | invo.com                                                     |
| $remote_addr         | 客户端ip地址                                                 | 127.0.0.1                                                    |
| $remote_port         | 客户端端口                                                   | 4204                                                         |
| **$http_user_agent** | 用户代理（“User-Agent”请求头的值)                            | Mozilla/5.0 (Windows NT 6.1; rv:50.0) Gecko/20100101 Firefox/50.0 |
| **$http_referer**    | “Http-Referer”请求头的值                                     | [http://invo.com](http://invo.com/)                          |
| $http_cookie         | “Cookie”请求头的值                                           | CA=abc;CB=123                                                |



## 二、常见坑点

> 404 或 403 没配置成功，就先去看 log 文件，查看文件访问位置

### 1. `root` 和 `alias`

主要区别在于 `root` 会将 `location` 中配置的内容加到路径中，`alias` 不会

```
server {
    ...
    
    location /root {
        root html;
    }
    
    location /alias {
        alias html;
    }
    
    location ~ /root/(\w+\.txt) {
        root html/third/$1;
    }
    
    location ~ /alias/(\w+\.txt) {
        alias html/third/$1;
    }
    
    location  /realpath/ {
        alias html/realpath/;
        return 200 '$request_filename:$document_root:$realpath_root\n';
    }
}
```

`/root` => `html/root`

`/root/a.txt` => `html/third/test.txt/root/a.txt`

`/alias` => `html`

`/alias/a.txt` => `html/third/a.txt`



### 2.  location 加不加 `/`

[参考文章](https://my.oschina.net/hongjiang/blog/4420771)

配置反向代理时，注意 `location` 中设置的 url 是否加 `/`

加了，则会作为绝对根路径处理，不会将匹配部分加到路径中

如未加，则会把匹配部分也加到路径中

以请求 `http://192.168.1.1/proxy/test.html ` 为例

```
location  /proxy/ {
    proxy_pass http://127.0.0.1:81/;
}
```

此时会代理到 `http://127.0.0.1:81/test.html `

```
location  /proxy/ {
    proxy_pass http://127.0.0.1:81/ftlynx;
} 
```

此时会代理到 `http://127.0.0.1:81/ftlynxtest.html`

```
location  /proxy {
    proxy_pass http://127.0.0.1:81;
}
```

此时会代理到 `http://127.0.0.1:81/proxy/test.html`



### 3. 设置代理后，静态资源 404

如原有请求 `http://www.hujingo.top/test/a.html`

代理到 `http://www.hujingo.top:81/test/a.html`

这时候静态资源的路径如果为 `/static/...` 绝对路径，则会发生不在预期文件夹内找资源的情况

自己试试比较好用的还是在打包的时候，将静态资源的路径改为相对位置

如在 React 项目中，建 `.env` 文件，设置环境变量 `PUBLIC_URL=.`



## 三、常见案例

### 1. 301 永久重定向

```
server {
  listen 80;
  server_name www.yourdomain.com;
  return 301 http://yourdomain.com$request_uri;
}
```

### 2. 302 临时重定向

```
server {
  listen 80;
  server_name yourdomain.com;
  return 302 http://otherdomain.com;
}
```

### 3. 反向代理

```
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://0.0.0.0:3000;
  }
}
```

### 4. 启用 gzip

> 启用 Gzip 所需的 HTTP 最低版本是 1.1

```
location ~ .*\. (jpg|png|gif)$ {
    gzip off; #关闭压缩
    root /data/www/images;
}

location ~ .*\. (html|js|css)$ {
	gzip on; #启用压缩    
	gzip_min_length 1k; # 超过1K的文件才压缩    
	gzip_http_version 1.1; # 启用gzip压缩所需的HTTP最低版本    
	gzip_comp_level 9; # 压缩级别，压缩比率越高，文件被压缩的体积越小    
	gzip_types text/css application/javascript; # 进行压缩的文件类型    
	root /data/www/html;
}
```

### 5.  请求限制

- limit_conn_module 连接频率限制
- limit_req_module 请求频率限制

```
# $binary_remote_addr 远程IP地址 zone 区域名称 10m内存区域大小limit_conn_zone $binary_remote_addr zone=coon_zone:10m;
server {   
	# conn_zone 设置对应的共享内存区域 1是限制的数量 
	limit_conn conn_zone 1;
}
```

```
# $binary_remote_addr 远程IP地址 zone 区域名称 10m内存区域大小 rate 为请求频率 1s 一次
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
server {
	location / {        
	# 设置对应的共享内存区域 burst最大请求数阈值 nodelay不希望超过的请求被延迟        
		limit_req zone=req_zone burst=5 nodelay;   
	}
}
```

### 6. 访问控制

- -http_access_module 基于 IP 的访问控制

```
server { 
	location ~ ^/index.html {  
 		# 匹配 index.html 页面 除了 127.0.0.1 以外都可以访问  
 		deny 127.0.0.1;  allow all; 
 	}
}
```

### 7. 防盗链

[$invalid_referer - nginx](http://nginx.org/en/docs/http/ngx_http_referer_module.html#var_invalid_referer)

```
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;

if ($invalid_referer) {
    return 403;
}
```

### 8. 负载均衡

upstream 定义上游主机`backend`和权重`weight`，最后在 `location` 中用 `proxy_pass` 将请求发送给上游主机

```
http {
    upstream backend {
        server localhost:8001     weight=1;
        server localhost:8002     weight=2;
    }

    server {
        listen       80;
        server_name  localhost;
        location / {
            proxy_pass http://backend;
        } 
    }

    include /usr/local/nginx/conf/conf.d/*.conf;
}
```

### 9. 判断设备

```
location / {
	set $is_mobile false;   #设置一个初始值
 
	if ( $http_cookie ~* "ACCESS_TERMINAL=mobile" ) {    #判断匹配手机端
		set $is_mobile true;
	}
	if ($http_user_agent ~* (android|ip(ad|hone|od)|kindle|blackberry|windows\s(ce|phone))) {    #匹配手机端类型
		set $is_mobile true;
	}
	if ($is_mobile = true) {
		root   /usr/pageA/;
		break;
	}
	root /usr/pageB/;
}
```

