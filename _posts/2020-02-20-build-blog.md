---
layout:     post
title:      "使用GitHub Pages搭建博客"
subtitle:   "从0到1全记录"
date:       2020-02-20 13:55:35
author:     "虎鲸"
header-img: "img/post-bg-build-blog.jpg"
tags:
    - 教程
---



### 1.创建 GitHub 仓库

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200219191042399.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NTM3NDE0,size_16,color_FFFFFF,t_70)



------

### 2.安装 Jekyll

参考文档：https://jekyllrb.com/docs/installation/windows/

- 下载 RubyInstaller 时，如速度很慢很慢，可以考虑尝试打开 科学 上网工具
- [Could not find a valid gem 'jekyll'](https://www.iteye.com/blog/sunxboy-2217811) 
- [Error fetching http://ruby.taobao.org/](https://segmentfault.com/q/1010000005914910)
  [Error fetching https://gems.ruby-china.org/](https://blog.csdn.net/w2i0l1l5y/article/details/82662224)

以上**三个报错的解决办法**为 -> 换为国内的源

```
//更换源
gem sources --remove https://rubygems.org/
gem sources -a https://gems.ruby-china.com/

gem sources -l
//显示以下内容 为换源成功
*** CURRENT SOURCES ***
https://gems.ruby-china.com/

//开始安装....
gem install jekyll bundler
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200219204210408.png)



------

### 3.参考主题 修改样式

**仓库推荐**

1.[huxpro.github.io](https://github.com/Huxpro/huxpro.github.io)  
[中文文档链接](https://github.com/Huxpro/huxpro.github.io/blob/master/README.zh.md)  
另一个修改了模板仓库的[说明](https://github.com/jsksxs360/xs-huxblog/blob/master/Document.md#install-jekyll)，建议结合使用
[效果预览](http://huangxuan.me/huxblog-boilerplate/)

2.[blog.io](https://github.com/cnfeat/blog.io)
文档见 readme 链接  
[效果预览](https://www.cnfeat.com/)

本文选择了第一个仓库链接作为博客模板

**步骤罗列**

1. 文件 clone 到本地
   `git clone git@github.com:Huxpro/huxblog-boilerplate.git`

2. 将自己的仓库 clone 到本地
   `git clone https://github.com/用户名/用户名.github.io.git`
3. 本地预览主题`jekyll serve`

2. 将 huxblog-boilerplate 中的内容 复制到 用户名.github.io 文件夹中
3. 根据仓库的文档，修改`_config.yml`
4. 修改其他页面，如 `index.html` , `about.html`, `tag.html`
   注意修改的不是文件夹 `_site` 中页面 

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020022010360032.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NTM3NDE0,size_16,color_FFFFFF,t_70)

6. 将文件上传到远程仓库中
   在 用户名.github.io 文件夹 下打开 git

```
git add .    //添加所有文件到版本库
git commit -m "some msg" //提交修改
git push -u origin master //将本地仓库push到github上
```

7. 打开 用户名.github.io 网页


**可能有的疑问**

- 网页中的标签是根据 `_post` 文件夹中文件里的 `tag` 显示的，不用纠结于修改
- 仓库上传后，用户名.github.io 网页 404
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200220105534332.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NTM3NDE0,size_16,color_FFFFFF,t_70)
  根据提示，最简单粗暴的办法是 删除文件 `README.zh.md`
- 打开页面，样式无法正常渲染，控制台报错找不到文件
  `Failed to load resource: the server responded with a status of 404 ()`
  `GET ... net::ERR_ABORTED 404`
  对比原仓库文件，检查`_config.yml`中关于路径的设置
- 模板文件为 `_layouts`文件夹下的`default.html
