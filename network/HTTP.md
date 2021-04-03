[rfc7231](https://tools.ietf.org/html/rfc7231)

[透视 HTTP 协议 — 极客时间](https://time.geekbang.org/column/article/98128)

[HTTP的前世今生](https://coolshell.cn/articles/19840.html)



## 历史

HTTP 协议始于三十年前蒂姆·伯纳斯 - 李的一篇论文；

HTTP/0.9 是个简单的文本协议，只能获取文本资源；

* 只支持 GET

HTTP/1.0 确立了大部分现在使用的技术，但它**不是正式标准**；

> GET，POST，HEAD

* 请求中加入 HTTP 版本号
* 有 header（控制逻辑和业务逻辑的分离）
* 增加状态码（控制错误和业务错误的分离）；`Content-Type`
* 每请求一个资源就新建一 TCP 连接，且串行请求

HTTP/1.1 是目前互联网上使用**最广泛**的协议，功能也非常完善；

> 新增 OPTIONS，PUT，DELETE，TRACE，CONNECT

> 支持四种网络协议：短连接；重用TCP的长连接；服务端push模型；WebSocket模型

* 可设置 `keepalive` 重用 TCP 连接
* 支持管道，不等前一个请求的响应回来就可以新发请求
* 支持 Chunked Responses
* 增加 cache control 机制；
* 协议头增加了 Language, Encoding, Type 等；增加 `host` 标注发起请求的域名
* 加入了 `OPTIONS` 方法，其主要用于 [CORS – Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 应用

HTTP/2 基于 Google 的 **SPDY** （ [ˈspiːdi] ）协议，注重性能改善，但还未普及；

* 二进制协议，增加数据传输效率
* 一个TCP链接中可并发请求多个HTTP请求
* 会压缩头：如发送多个重复/相似头的请求，协议会消除重复部分
* 允许服务端在客户端放cache
* 如果发生丢包，所有请求都需要等丢失的包重传

HTTP/3 基于 Google 的 **QUIC** 协议，是将来的发展方向。

> QUIC是一个在UDP之上的伪TCP +TLS +HTTP/2的多路复用的协议

* 将底层 TCP 协议改为 UDP 协议
* 把 TCP 的和 TLS 的合并成了三次握手

![协议栈对比图](https://static001.geekbang.org/resource/image/d2/03/d263202e431c84db0fd6c7e6b1980f03.png)



## 一、总览

### 1. 对 HTTP 协议的理解

**是什么**

> HTTP 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范

超文本传输协议

**特点**

> 超文本，传输，灵活性，连接方式，应用层

* 传输内容不限于文本，支持传输图片，音频，视频等

* <u>双向</u>协议

  我们将发起传输动作的称为请求方，接到传输请求的称为响应方

  传输过程中可以存在也遵循 HTTP 协议的中间人，再添加额外的功能，如认证，数据压缩等

* 灵活可拓展

  可以利用报文结构，添加特定头字段实现特定功能

* 使用的是请求 - 应答通信模式

  请求方主动发起请求，而应答方被动回复请求

  服务器不是一定为应发方，作为代理时，可能既是请求方又是应答方

* 有连接无状态

  > HTTP/1.1 中改成了默认启动 keepalive 长连接机制，因此是 “有连接” 的

  顺序发包顺序收包，按照收发的顺序管理报文；

  但每个请求相互独立，不需要客户端或服务端记录请求相关信息，可以轻松实现集群化

* 应用层协议，依赖于很多其他技术

  如依赖 IP 协议实现寻址， TCP协议提供可靠传输，DNS 协议实现域名查找， SSL/TLS 协议实现安全通信等

**问题**

> <u>抛开场景说优缺点都是耍流氓</u>！！

> 无状态，明文，安全（身份，内容），性能

> http协议的状态行、头字段都用的是ASCII码，可以直接看，而tcp的头用的是二进制位，不能直接看

* 无状态，没有记忆能力，有时需要借 Cookie 实现有状态，如携带身份信息

* 明文传输，header 部分不使用二进制传输，而使用文本形式，同时也有可能造成数据冗余

* 没有有效手段确认通信双方真实身份

* 无完整性校验，在传输过程中可被篡改，不法验证真伪

* 性能一般

  高并发场景下，不能保证稳定的链接质量，TCP 表现不一定好

  “请求—应答”模式，可能造成 “队头阻塞”情况，即当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据



### 2. HTTP 报文

HTTP 协议的请求报文和响应报文的结构基本相同，由三大部分组成：

**起始行**（start line）：描述请求或响应的基本信息；

* 请求行由请求方法，请求目标 URI，版本号组成，`GET / HTTP/1.1`
* 响应行由版本号，状态码，文字描述组成，`HTTP/1.1 200 OK`

**头部字段集合**（header）：使用 key-value 形式更详细地说明报文；

* 通用字段：在请求头和响应头里都可以出现；
* 请求字段：仅能出现在请求头里，进一步说明请求信息或者额外的附加条件；
* 响应字段：仅能出现在响应头里，补充说明响应报文的信息；
* 实体字段：它实际上属于通用字段，但专门描述 body 的额外信息。

**消息正文**（entity）：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据。

HTTP协议可以没有body，但**必须有header**（起始行 + 头部字段集合）。而且header之后必须要有一个空行，也就是 “CRLF”，十六进制的“0D0A”

HTTP/1.1 里唯一要求必须提供的头字段是 **Host**，它**必须出现在请求头**里，标记虚拟主机名

<img src="../image/network/http请求报文.png" alt="http请求报文" style="zoom:48%;" />

<img src="../image/network/http响应报文.png" alt="http响应报文" style="zoom:54%" />

**字段相关**

> **MIME Type**
>
> text：即文本格式的可读数据，我们最熟悉的应该就是 text/html 了，表示超文本文档，此外还有纯文本 text/plain、样式表 text/css 等。
>
> image：即图像文件，有 image/gif、image/jpeg、image/png 等。
>
> audio/video：音频和视频数据，例如 audio/mpeg、video/mp4 等。
>
> application：数据格式不固定，可能是文本也可能是二进制，必须由上层应用程序来解释。常见的有 application/json，application/javascript、application/pdf 等，另外，如果实在是不知道数据是什么类型，就会是 application/octet-stream，即不透明的二进制数据

> **Encoding Type**
>
> gzip：GNU zip 压缩格式，也是互联网上最流行的压缩格式；
>
> deflate：zlib（deflate）压缩格式，流行程度仅次于 gzip；
>
> br：一种专门为 HTTP 优化的新压缩算法（Brotli）。

* 理解 body 数据类型 => MIME type，Encoding type

  请求：Accept，Accept-Encoding

  响应：Content-Type，Content-Encoding

  ```
  Accept: text/html,application/xml,image/webp,image/png
  Accept-Encoding: gzip, deflate, br
  
  Content-Type: text/html
  Content-Encoding: gzip
  ```

* 理解语言类型与字符编码格式

  > 不过现在的浏览器都支持多种字符集，通常不会发送 Accept-Charset，而服务器也不会发送 Content-Language，因为使用的语言完全可以由字符集推断出来

  请求：Accept-language，Accept-Charset

  响应：Content-language

  ```
  Accept-Language: zh-CN, zh, en
  Accept-Charset: gbk, utf-8
  
  Content-Language: zh-CN
  Content-Type: text/html; charset=utf-8
  ```

* 内容协商

  `q=value`，注意此时 `;` 的意义小于 `,` 

  权重的最大值是 1，最小值是 0.01，默认值是 1，如为 0 则表示拒绝

  ```
  Accept: text/html,application/xml;q=0.9,*/*;q=0.8
  ```

**通用首部字段**

<img src="../image/network/http通用首部字段.jpg" alt="通用首部字段" style="zoom:80%;" />

**请求首部字段**

<img src="../image/network/http请求首部字段.jpg" alt="请求首部字段" style="zoom:80%;" />

**响应首部字段**

<img src="../image/network/http响应首部字段.jpg" alt="响应首部字段" style="zoom:80%;" />

**实体首部字段**：请求和响应里都可以用

<img src="../image/network/http实体首部字段.jpg" alt="实体首部字段" style="zoom:80%;" />







## 二、请求方法

> 在 HTTP 协议里，所谓的“安全”是指请求方法不会“破坏”服务器上的资源，即不会对服务器上的资源造成实质的修改。
>
> 按照这个定义，GET，HEAD，OPTIONS 方法是“安全”的

> 幂等，指多次执行相同的操作，结果也都是相同的，即多次“幂”后结果“相等”。
>
> 具有幂等性的请求方法：GET，HEAD，PUT，DELETE

### 1. 有哪些请求方法

[GET](https://tools.ietf.org/html/rfc7231#section-4.3.1)：获取资源，可以理解为读取或者下载数据；

[HEAD](https://tools.ietf.org/html/rfc7231#section-4.3.2)：获取资源的元信息；

[POST](https://tools.ietf.org/html/rfc7231#section-4.3.3)：向资源提交数据，相当于写入或上传数据；

[PUT](https://tools.ietf.org/html/rfc7231#section-4.3.4)：创建或替换目标资源；

PATCH：对资源部分修改

DELETE：删除资源；

CONNECT：建立特殊的连接隧道；

OPTIONS：列出可对资源实行的方法（Nginx 默认不支持，CORS 中发预检请求）；

TRACE：追踪请求 - 响应的传输路径。



### 2. GET 和 POST 区别

[GET 和 POST 到底有什么区别？- 大宽宽](https://www.zhihu.com/question/28586791/answer/767316172)

**浏览器中**（**非**Ajax的HTTP请求）

* 幂等性

  GET 是幂等的，多次读取不会影响被访问的数据，因此可以缓存；

  POST 是非幂等的，不能随意执行多次；

  如将 GET 实现为非幂等是没有必要的，甚至会带来安全问题，但将 POST 实现为幂等的，有利于防范重复提交等潜在的问题

* 携带数据的形式

  GET 携带数据只能依赖于 url 传参（query 或 params）；

  POST 可通过 url 携带数据，更常见的是表单提交，通过 body 传输；

  浏览器发出的POST请求的body主要有两种格式：

  一种是 `application/x-www-form-urlencoded` 用来传输简单的数据，形如：

  ```
  key1=value1&key2=value2
  ```

  另外一种是`multipart/form-data`，用于传文件，相比另一种格式处理二进制数据更高效

**接口中**

```
<METHOD> <URL> HTTP/1.1\r\n
<Header1>: <HeaderValue1>\r\n
<Header2>: <HeaderValue2>\r\n
...
<HeaderN>: <HeaderValueN>\r\n
\r\n
<Body Data....>
```

接口规范代表 [RESTful API](https://restfulapi.cn/)

>    A payload within a GET request message has no defined semantics;
>    sending a payload body on a GET request might cause some existing
>    implementations to reject the request.

* GET，POST 均可以用过 url 或 body 传参

* GET 一般不建议带 body，可能会导致被拒绝请求

  主要原因还是与原有设计语义不符，获取请求和携带大量数据相违背

**安全**

* 两个都不安全
* 私密数据在 body 中也可以被记录， url 避免携带敏感数据，因为会在 log 文件中完整记录
* 通过 https 提高安全性
* 敏感数据选择 POST + body 更合适

**长度限制**

> 只要某个要开发的资源/api的URL长度**有可能达到2000个bytes以上，就必须使用body来传输数据，除非有特殊情况**。至于到底是GET + body还是POST + body可以看情况决定。

> 1个汉字字符经过UTF8编码 + percent encoding后会变成9个字节

* 常说的 “GET数据有长度限制 “其实是指”URL的长度限制“
* HTTP协议本身对URL长度并没有做任何规定。实际的限制是由客户端/浏览器以及服务器端决定的。 
* IE8 的限制为 2048 个字符；Chrome 限制为 2MB
* POST 也是相似的，主要起限制作用的是服务器的处理程序的处理能力



### 3. POST 和 PUT 区别

>    The fundamental difference between the POST and PUT methods is
>    highlighted by the different intent for the enclosed representation.
>    The target resource in a POST request is intended to handle the
>    enclosed representation according to the resource's own semantics,
>    whereas the enclosed representation in a PUT request is defined as
>    replacing the state of the target resource.  Hence, the intent of PUT
>    is **idempotent and visible to intermediaries**, even though the exact
>    effect is only known by the origin server.

都是向服务器提交数据，主要的区别在于**幂等性**

* POST 是非幂等的，如表单提交多次，建立多条记录，存在副作用
* PUT 是幂等的，多次调用与一次调用的结果相同，没有副作用



### 4. GET 和 HEAD 区别

都是请求从服务器获取数据，可被缓存

* GET 请求会返回请求的实体数据，HEAD 不会，只传回响应头
* HEAD 适合用于不需要真的获取资源的情况，如检查文件是否存在，确认 URI 有效性，资源更新日期等



## 三、状态码

[透视 HTTP 协议](https://time.geekbang.org/column/article/102483)

[[FIXED] 403 Forbidden Error on Nginx Web Server](https://www.basezap.com/fixed-403-forbidden-error-on-nginx-web-server/#:~:text=Many%20times%20you%20will%20face%20a%20403%20Forbidden,we%20will%20discuss%20these%20reasons%20one%20by%20one.)

用于表达 HTTP 数据处理的“状态”，并不仅限于错误

**1××：提示信息，表示请求已接收，还需要后续处理**

* 101 Switching Protocols：

  客户端使用 Upgrade 字段，在`HTTP`基础上升级为`WebSocket`，如果服务器同意变更，就会发送状态码 101。

**2××：成功，报文已经收到并被正确处理；**

* 200，OK

  最常见，表示请求处理成功。如果是非 HEAD 请求，通常在响应头后都会有 body 数据

* 204，NO Content

  与 200 相似，但表示响应头后没有 body 数据。实际使用中，常都用 200 处理

* 206，Partial Content

  表示成功处理了资源的一部分。在实现断点续传时会遇到，常和头字段 Content-Range 一起使用

**3××：重定向，资源位置发生变动，需要客户端重新发送请求；**

> 301，302都会在响应头中使用字段 Location，表明要跳转到的 URL
>
> 主要区别在于语义

* 301，Moved Permanently

  永久重定向。如将网站升级到 https 后，在 Nginx 配置时会将 http 的页面使用 301 重定向。浏览器收到 301 后，会做缓存优化，第二次直接访问新地址。

  ```
  return 301 https://$server_name$request_uri;
  ```

* 302，Found

  临时重定向。适合用于如系统维护，显示暂时关闭服务页面的情况，浏览器不会做缓存优化，下次还是访问原来的地址

* 304，Not Modified

  表示资源未修改，客户端可使用本地缓存。处理协商缓存的时候会遇到。

  服务器通过请求头中的 `If-Modified-Since` 或者 `If-None-Match` 这些条件请求字段检查资源是否更新，如未更新，则返回 304

**4××：客户端错误，请求报文有误，服务器无法处理；**

* 400 Bad Request

  通用错误码，表示请求报文有误，但没明确指出原因，比较笼统，尽量避免使用

* 403，Forbidden

  表示服务端禁止访问该资源。在 Nginx 配置过程中，如将文件位置写错，则容易遇到 403 错误，错误访问到内部文件；或在设有多角色的系统时，如低权限请求高权限的数据，也会做返回 403 处理

* 404，Not Found

  资源未找到，4XX 中最常见

* 401 Unauthorized：登录时未携带授权信息

* 405 Method Not Allowed：不允许使用某些方法操作资源，例如不允许 POST 只能 GET；

* 406 Not Acceptable：资源无法满足客户端请求的条件，例如请求中文但只有英文；

* 408 Request Timeout：请求超时，服务器等待了过长的时间；

* 409 Conflict：多个请求发生了冲突，可以理解为多线程并发时的竞态；

* 413 Request Entity Too Large：请求报文里的 body 太大；

* 414 Request-URI Too Long：请求行里的 URI 太大；

* 429 Too Many Requests：客户端发送了太多的请求，通常是由于服务器的限连策略；

* 431 Request Header Fields Too Large：请求头某个字段或总体太大；

**5××：服务器错误，服务器在处理请求时内部发生了错误**

* 500 Internal Server Error：通用错误码
* 501 Not Implemented：请求的功能暂不支持（即将开业，敬请期待）
* 502 Bad Gateway：服务器作为网关或者代理时返回的错误码，表示服务器自身工作正常，访问后端服务器时发生了错误
* 503 Service Unavailable：服务器当前很忙，暂时无法响应服务



## 四、高频首部

> 缓存相关的 header

### 1. 如何不改变 GET 请求的参数拿到不一样的数据

* 在 URI 后使用“#”，就可以在获取页面后直接定位到某个标签所在的位置；

* 使用 If-Modified-Since 字段就变成了“有条件的请求”，仅当资源被修改时才会执行获取动作；

* 使用 Range 字段就是“范围请求”，只获取资源的一部分数据。



## 五、扩展

### 1. 如何复用 http 连接

[Keep-Alive - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Keep-Alive)

> HTTP/1.0 中默认是关闭的，http 1.1中默认启用Keep-Alive
>
> 在HTTP/2 协议中， [`Connection`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Connection) 和 [`Keep-Alive`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Keep-Alive) 是被忽略的
>
> 不用一次请求建一次连接，连接次数更少，节省开销

> “连接”其实**是对某个域名的**，而不是某个ip或主机

* 设置 `Connection: Keep-Alive`

```
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Thu, 11 Aug 2016 15:23:13 GMT
Keep-Alive: timeout=5, max=1000
Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
Server: Apache
```

需要注意的是：

过多的长连接会占用服务器资源，所以服务器会用一些策略有选择地关闭长连接；

客户端可以在请求头里加上“Connection: close”字段，来关闭连接

服务端，以 Nginx 为例，可以进行相关配置：

* 使用“keepalive_timeout”指令，设置长连接的超时时间，如果在一段时间内连接上没有任何数据收发就主动断开连接，避免空闲连接占用系统资源。
* 使用“keepalive_requests”指令，设置长连接上可发送的最大请求次数。比如设置成 1000，那么当 Nginx 在这个连接上处理了 1000 个请求后，也会主动断开连接。



### 2. 如何传输大文件

> "Transfer-Encoding: chunked” 和 “Content-Length” 这两个字段是互斥的

数据压缩

* 使用 gzip 压缩文本文件，并不适合处理图片、音频视频等多媒体数据

分块

> 分块传输中数据里含有回车换行（\r\n）不影响分块处理

* 在响应报文里用头字段“Transfer-Encoding: chunked”

范围请求

> 应用：视频拖拽进度条，断点续传

* 服务器在响应头里使用字段 “Accept-Ranges: bytes” 表示支持范围请求
* 使用 “Accept-Ranges: none”，或不传递 “Accept-Ranges” 字段表示不支持
* 请求头 Range 是 HTTP 范围请求的专用字段，格式是“bytes=x-y”，其中的 x 和 y 是以字节为单位的数据范围。**针对原文件**。
* 服务器要添加一个响应头字段 Content-Range，告诉片段的实际偏移量和资源的总大小，格式是“bytes x-y/length”，如 “bytes 0-10/100“
* 状态码 206



### 4. 如何理解重定向

> 避免滥用及循环跳转

重定向，由服务器来发起的，浏览器使用者无法控制，用户无感知

实际共发送了两次请求

* 在第一次请求的响应字段中会包含 `location`，标记了服务端要求重定向的 URI
* 如果想跳转到站外，必须使用绝对 URL

```
第一次
General
Request URL: http://www.hujingo.top/
Request Method: GET
Status Code: 301 Moved Permanently

Response Header
Location: https://www.hujingo.top/

第二次
General
Request URL: https://www.hujingo.top/
Request Method: GET
Status Code: 200
```



## 六、HTTPS

> HTTPS 与 HTTP 协议相比，最重要的是增加安全性
>
> 这种安全性的实现主要是依赖于两个协议底层依赖的协议是不同的

安全的四大指标：

* 机密性：只能由可信的人访问

* 完整性：数据在传输过程中没有被篡改

* 身份认证：确认对方的真实身份
* 不可否认：不能否认已经发生过的行为



**是什么**

语法语义依然还是 HTTP

只是由原来的直接和 TCP 通信，变为先和 SSL/TLS 通信，再由 SSL/TLS 通信和 TCP 通信

**为什么**

解决原有安全问题：如明文传输，无法进行完整性校验，无法验证身份

![图例](https://static001.geekbang.org/resource/image/50/a3/50d57e18813e18270747806d5d73f0a3.png)

### SSL / TSL

> SSL，安全套接层（Secure Sockets Layer），既有会话功能，又能加密解密
>
> TSL，传输层安全（Transport Layer Security），TLS1.0 实际上就是 SSLv3.1

目前应用的最广泛的 TLS 是 1.2

TLS 由记录协议、握手协议、警告协议、变更密码规范协议、扩展协议等几个子协议组成，综合使用了对称加密、非对称加密、身份认证等许多密码学前沿技术

TLS 密码套件 = 密钥交换算法 + 签名算法 + 对称加密算法 + 摘要算法

* 密钥交换算法，用于握手时进行密钥交换
* 签名算法：用于身份认证
* 对称加密算法：用于握手后的通信
* 摘要算法：用于消息认证和产生随机数

### 加密与非对称加密

> 对称密钥一般都128位、256位，而rsa一般要2048位

按照密钥的使用方式，加密可以分为两大类：对称加密和非对称加密。

* **对称加密**：加密和解密时使用的密钥都是同一个

  目前常用的只有 **AES 和 ChaCha20**

  分组模式，用于将固定长度密钥加密成任意长度的密文

  常用的是 GCM、CCM 和 Poly1305

  <u>运行速度快，但密钥交换过程存在隐患</u>

* **非对称加密**：公钥可以公开给任何人使用，而私钥必须严格保密

  > 基于大数运算，比如大素数或者椭圆曲线等复杂的数学难题

  具有单向性：公钥加密只能由私钥解密，私钥加密后只能用公钥解密

  在 TLS 里只有很少的几种，比如 DH、DSA、**RSA、ECC** 等

  <u>解决密钥交换问题，但运行速度慢</u>

* **混合加密**：

  TLS 里使用的加密方式

  使用非对称加密传递对称密钥

  一次非对称加密后，全部使用对称加密

  一次会话一个私钥

### 数字签名与证书

> 真正的完整性必须要建立在机密性之上

实现完整性的手段主要是**摘要算法**（散列函数、哈希函数）

摘要算法对输入具有“单向性”和“雪崩效应”

TLS 推荐使用的是 SHA-1 的后继者：SHA-2（一系列摘要算法的总称）

常用的有 SHA224、SHA256、SHA384，分别能够生成 28 字节、32 字节、48 字节的摘要

![加入摘要后的图例](https://static001.geekbang.org/resource/image/c2/96/c2e10e9afa1393281b5633b1648f2696.png)

**数字签名**用于确认身份，私钥加密原文的摘要、公钥解密

![加入签名后的图例](https://static001.geekbang.org/resource/image/84/d2/84a79826588ca35bf6ddcade027597d2.png)

公钥的分发需要使用**数字证书**，必须由 CA 的信任链来验证，否则就是不可信的；

作为信任链的源头 CA 有时也会不可信，解决办法有 CRL（证书吊销列表）、OCSP（在线证书状态协议），还有浏览器终止信任

证书信任链的验证过程（三级为例）：

客户端发现当前网站的证书是二级CA，在可信任签发机构中找不到，

就会去拿二级CA的数字证书的签发机构去做检查，发现它是一级CA，

也不在可信任签发机构中，再找一级CA的数字证书的签发机构，发现是受信任的ROOT CA，

至此完成验证。如果到最后一层CA都不受信任，就会警告用户



### TLS 协议的组成

* **记录协议**：规定了 TLS 收发数据的基本单位 —— 记录

* **警报协议**：向对方发出警报信息，如不支持旧版本，证书有问题等
* **握手协议**：浏览器和服务器会在握手过程中协商 TLS 版本号、随机数、密码套件等信息，然后交换证书和密钥参数，最终双方协商得到会话密钥，用于后续的混合加密系统
* **变更密码规范协议**：告诉对方，后续的数据都将使用加密保护



### TLS 握手过程

> TLS1.3 大幅度删减了加密算法，只保留了 ECDHE、AES、ChaCha20、SHA-2 等极少数算法，强化了安全

> 以下为 TLS1.2 

> HTTPS 协议会先与服务器执行 TCP 握手，然后执行 TLS 握手，才能建立安全连接
>
> 握手的目标是安全地交换对称密钥

**第一阶段：C/S两端共享Client Random、Server Random 和 Server Params信息**
客户端--->服务器：“Client Hello” 
客户端的版本号、支持的密码套件，还有一个随机数（Client Random）

服务端--->客户端："Server Hello"
客户端的版本号、选择的客户端列表的密码套件如：TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、随机数（Server Random）

服务端--->客户端：
服务端证书（Server Certificate）


服务端--->客户端："Server Key Exchange"
携带椭圆曲线的公钥（Server Params）用以实现密钥交换算法，另附私钥签名


服务端--->客户端：“Server Hello Done”
发送完毕



> 此时为单向认证。如为双向认证，
>
> 客户端还要发送“Client Certificate”消息，服务器收到后也把证书链走一遍，验证客户端的身份



**第二阶段：证书验证**

前验条件：客户端**证书链逐级验证**、证书公钥验证签名，服务端身份验证成功（证书合法）

客户端--->服务端 “Client Key Exchange“

携带椭圆曲线的公钥（Client Params）用以实现秘钥交换算法


**第三阶段：主密钥生成**

客户端、服务端分别使用Client Params、Server Params通过ECDHE算法计算出随机值pre-master，然后用
Client Random、Server Random 和 Pre-Master三个值作为原材料，用PRF伪随机数函数（利用密码套件的摘要算法再次强化结果值maser secert的随机性）计算出主密钥Master Secret，

主密钥并不是会话秘钥，还会再用PRF扩展出更多的密钥，比如客户端发送用的会话密钥（client_write_key）、服务器发送用的会话密钥（server_write_key）

客户端--->服务端:
客户端发一个“Change Cipher Spec”，然后再发一个“Finished”消息，把之前所有发送的数据做个摘要，再加密一下，让服务器做个验证.

服务端--->客户端：
服务器也是同样的操作，发“Change Cipher Spec”和“Finished”消息，双方都验证加密解密 OK，握手正式结束.

![记不住但不得不记住的TCP握手](https://static001.geekbang.org/resource/image/9c/1e/9caba6d4b527052bbe7168ed4013011e.png)



### 如何优化

**硬件优化**

> HTTPS 属于计算密集型

* 更快的 CPU
* SSL 加速卡，SSL 加速服务器

**软件优化**

* 软件升级（最可行）

**协议优化**

* 握手时使用的密钥交换协议应当尽量选用椭圆曲线的 **ECDHE** 算法。它不仅运算速度快，安全性高，还支持“False Start”，能够把握手的消息往返由 2-RTT 减少到 1-RTT
* 椭圆曲线也要选择高性能的曲线，最好是 x25519，次优选择是 P-256

**证书优化**

* 证书传输

  证书可以选择椭圆曲线（ECDSA）证书，文件更小，节约带宽，减少客户端的运算量

* 证书验证

  服务器端开启“OCSP Stapling”（OCSP 装订），可以预先访问 CA 获取 OCSP 响应，然后在握手时随着证书一起发给客户端

**会话复用**

> 重复利用主密钥，避免重复计算，空间换时间
>
> 可跳过密钥交换、证书验证等步骤，直接开始加密通信

* “Session ID”：需要服务器来存储会话
* “Session Ticket”：在客户端保存，为了做到“前向安全”，需要经常更换密钥
* PSK：Session Ticket的强化版，也有ticket，但应用数据随ticket一起发给服务器

![TLS握手过程影响性能部分标注](https://static001.geekbang.org/resource/image/c4/ed/c41da1f1b1bdf4dc92c46330542c5ded.png)



## 七、HTTP/2

[深入理解http2.0协议，看这篇就够了！](https://mp.weixin.qq.com/s/a83_NE-ww36FZsy320MQFQ)

> 唯一目标就是改进性能

> HTTP 的“无状态”是指对事务处理没有记忆，每个请求之间都是独立的
>
> 流状态转换只是表示一次请求应答里流的状态，都不会记录之前事务的信息
>
> HTTP/2 还是无状态的！

> http/1里的请求都是排队处理的，所以有队头阻塞
>
> http/2的请求是乱序的，彼此不依赖，所以没有队头阻塞

* HTTP 协议取消了小版本号，所以 HTTP/2 的正式名字不是 2.0；

* HTTP/2 在“语义”上兼容 HTTP/1，保留了请求方法、URI 等传统概念；

* HTTP/2 废除了起始行，统一使用头字段，在两端维护字段“Key-Value”的索引表，使用“HPACK”算法**压缩头部**信息，消除冗余数据节约带宽（字典，索引，哈夫曼编码）；

* HTTP/2 的消息不再是“Header+Body”的形式，而是分散为多个**二进制“帧”**，报头里最重要的字段是流标识符，标记帧属于哪个流；

  > 从传输的角度来看流是不存在的，只是看到了一个个帧，所以说流是虚拟的

* HTTP/2 使用虚拟的**“流”**传输消息。流是二进制帧的双向传输序列，相当于 HTTP/1 里的一次“请求 - 应答”

  流 ID 不能重用，只能顺序递增，客户端发起的 ID 是奇数，服务器端发起的 ID 是偶数

* 在一个 HTTP/2 连接上可以并发多个流，也就是多个“请求 - 响应”报文，这就是“**多路复用**”，可以提高连接的利用率

* 服务器可新建“流”主动向客户端发送消息，“**服务器推送**”

* 请求是乱序的，彼此不依赖，，在应用层解决队头阻塞问题（TCP 中依然存在）；

* HTTP/2 也增强了安全性，要求至少是 TLS1.2，而且禁用了很多不安全的密码套件。

<img src="https://static001.geekbang.org/resource/image/61/e3/615b49f9d13de718a34b9b98359066e3.png" alt="报文图例" style="zoom:80%;" />



## 八、HTTP/3

[HTTP3.0和QUIC协议那些事](https://blog.csdn.net/qq_44537414?spm=1001.2101.3001.5343)

### QUIC

> 早期 Google 发明的 QUIC，被称为 gQUIC，混合了 UDP、TLS、HTTP，是一个应用层的协议
>
> 目前常说的 QUIC，指 IETF 将它进行分离后的结果，指 iQUIC，是一个传输层的协议

* QUIC 的基本数据传输单位是包（packet）和帧（frame），一个包由多个帧组成，包面向的是“连接”，帧面向的是“流”

* QUIC 的帧里有多种类型，PING、ACK 等帧用于管理连接，而 STREAM 帧专门用来实现流
* HTTP/2 里的流都是双向的，而 QUIC 则分为双向流和单向流
* 客户端的流 ID 是偶数，从 0 开始计数
* QUIC 内含了 TLS1.3，只能加密通信，支持 0-RTT 快速建连
* QUIC 的连接使用“不透明”的连接 ID，不绑定在“IP 地址 + 端口”上，支持“连接迁移”
* QUIC 本身已经支持了加密、流和多路复用

![QUIC帧结构](https://static001.geekbang.org/resource/image/9a/10/9ab3858bf918dffafa275c400d78d910.png)

### HTTP/3

> HTTP/3在QUIC层定义流、帧，真正解决队头阻塞，HTTP/2流、帧是在TCP层上抽象出的逻辑概念。
> 相同点是在逻辑理解上是基本一致的，流由帧组成，多个流可以并发传输互不影响。

HTTP/3 基于 QUIC 协议，完全解决了“队头阻塞”问题，弱网环境下的表现会优于 HTTP/2；

HTTP/3 没有指定默认的端口号

浏览器需要先用 HTTP/2 协议连接服务器，然后服务器可以在启动 HTTP/2 连接后发送一个“Alt-Svc”帧，包含一个“h3=host:port”的字符串，告诉浏览器在另一个端点上提供等价的 HTTP/3 服务。

浏览器收到“Alt-Svc”帧，会使用 QUIC 异步连接指定的端口，如果连接成功，就会断开 HTTP/2 连接，改用新的 HTTP/3 收发数据。

![HTTP/3报文结构](https://static001.geekbang.org/resource/image/26/5b/2606cbaa1a2e606a3640cc1825f5605b.png)