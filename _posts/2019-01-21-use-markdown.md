---
layout:     post
title:      "markdown 使用笔记"
subtitle:   "写给自己看的 markdown 指南"
date:       2019-01-21 11:28:19
author:     "虎鲸"
header-img: "img/post-bg-markdown.jpg"
catalog:    true
tags:
    - markdown
---



Typora教程 <https://blog.csdn.net/cris_zz/article/details/82919401#25_313> 

***

###  <font color=#f08080  size=5 >字体设置</font>

#### :one:斜体

​      \* 文字 \*    =>    *文字*

​       \_文字\_      =>    _文字_

#### :two:加粗

​    \**文字**    =>    **文字**

​    \_\_文字\_\_      =>    __文字__

#### :three:删除线

   \~\~文字\~\~     =>   ~~文字~~

***

 ###  <font color=#f08080  size=5 >标题设置</font>

:one:\#\# 文字   

:running_man: .........### 

***

### <font color=#f08080  size=5 >插入图片</font>

:one: ! [图片描述]\(图片地址)

​      ![biang](https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=a3aded747ff08202399f996d2a929088/2934349b033b5bb5c70c29a93ad3d539b700bc89.jpg)

***

### <font color=#f08080  size=5 >插入链接</font>

:one:\<链接>

​     <https://baike.baidu.com/item/biang/2015710?fr=aladdin>

***

### <font color=#f08080  size=5 >分割线</font>

### :one:  \-\-\-       

### :two:  \*\*\*

### :three:  _\_\_

____

### <font color=#f08080  size=5 >代码块</font>

:one:\`\`\`

```python
print "hello world"
```

***

### <font color=#f08080  size=5 >行内式</font>

### <font color=#f08080  size=5 >行内式</font>:wrench:

:one:\`代码\`

​    `print  "hello world"`

***

### <font color=#f08080  size=5 >引用</font>

#### :one:\> 文字

> 文字

#### :two:>\> 文字

> > 文字

#### :three: \>\*\*加粗文字\*\*

> **加粗文字**

#### :four: 引用\#\#\#...分级标题

> ###### 分级标题

:runner: ......请继续1+1大法

***

### <font color=#f08080  size=5 >列表</font>

:one:\*    or    +    or    -

* :heart:

+ :crossed_fingers:

- :love_letter:

:two:1.      2.      3

1.  :moon:
2.  :smile:

3.空格不能少:warning:

:three: to do list

\- \[ ] 文字

- [ ] to do
- [x] done

:pushpin:1. 加粗效果不能直接用于列表标题里面，但是可以嵌套在列表里面混合     使用。 

2. 列表中包含代码块（前面加2个tab或者8个空格，并且需要空一行，否则不显示）

***

### <font color=#f08080  size=5 >表格</font>

:one:

\|错误类型 \|原因 \|表现\|

内容填入

| 错误类型 | 原因                             | 表现                                | 杀伤力 | 修改难度 |
| -------- | -------------------------------- | ----------------------------------- | ------ | -------- |
| 编译错误 | 不符合C 语言基本语法要求         | 编译器的吼叫（error）或嘟囔（warn） | ★★     | ★★       |
| 运行错误 | 非法操作，如被零除或读取非法内存 | 操作系统终止该程序运行              | ★★★★   | ★★★★     |
| 逻辑错误 | 算法级或逻辑级错误               | 程序正常运行，但是结果不对          | ★★★★★  | ★★★★★    |

***

### <font color=#f08080  size=5 >特殊符号</font>

:one:详见<https://unicode-table.com/cn/>

|   代码    |   结果   |
| :-------: | :------: |
| &#10084； | &#10084; |
| &#10003； | &#10003; |
| &#9728；  | &#9728;  |
| &#9733；  | &#9733;  |
| &#9730；  | &#9730;  |
| &#10052； | &#10052; |
| &#9835；  | &#9835;  |

:two:emoji     详见 <https://emojipedia.org/>

***

### <font color=#f08080  size=5 >字体字号颜色背景色</font>

<font face="楷体" size = 3 color=black>文字</font>

\<font face="楷体" size = 3 color=black>文字\</font>

:one: 字体  face (脸型)

\<font face="楷体">文字\</font>

##### <font face="楷体">文字</font>

:two: 字号   size (尺寸)

\<font size=4>文字\</font>

<font size=2>文字</font>

:three:  颜色   color (肤色)

\<font color=gray>文字\</font>

<font color=gray>文字</font>

![可查](https://img-blog.csdn.net/20180802162907453?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQwNjE2MzA=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dis)

:four: 背景色

```
 <table><tr><td bgcolor=yellow>背景色是：yellow</td></tr></table>
```

  <table><tr><td bgcolor=teal>背景色是：teal</td></tr></table>

***

### <font color=#f08080  size=5 >目录</font>

:one: \[TOC]  全文目录

***

### <font color=#f08080  size=5 >链接</font>

:one:行内式

这是一个\[例子]\(https://www.appinn.com/markdown/#link"参考教程")

这是一个[例子](https://www.appinn.com/markdown/#link"参考教程")

:two:参考式

这也是一个\[例子][id]

这也是一个[例子][1]

(在文章任一位置)

[1]: https://www.appinn.com/markdown/#link "title"

:pushpin:

- 方括号（前面可以选择性地加上至多三个空格来缩进），里面输入链接文字
- 接着一个冒号
- 接着一个以上的空格或制表符
- 接着链接的网址
- 选择性地接着 title 内容，可以用单引号、双引号或是括弧包着
- 链接辨别标签可以有字母、数字、空白和标点符号，但是并**不**区分大小写

***

### <font color=#f08080  size=5 >注脚</font>

:one:比如这里需要加注[^1]

[^1]:参考<https://blog.csdn.net/u014061630/article/details/81359144#24-分割线>

***

### <font color=#f08080  size=5 >数学公式</font>:wrench:

参考链接<https://www.mohu.org/info/symbols/symbols.htm>

***

### <font color=#f08080  size=5 >流程图</font>

:one: \`\`\`     =>     flow

st=>start: 开始
op1=>operation: My Operation
c=>condition: Yes or No?
e=>end: 结束

st->op1->c
c(yes)->e
c(no)->op1

```flow
st=>start: 开始
op1=>operation: My Operation
c=>condition: Yes or No?
e=>end: 结束

st(right)->op1(right)->c
c(yes, right)->e
c(no,top)->op1
```

***

### <font color=#f08080  size=5 >序列图</font>

:one:

```sequence
A->B:wrong answer
Note left of B:pending
B-->A:P E
```



