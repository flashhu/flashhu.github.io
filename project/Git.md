# Git

[三年 Git 使用心得 & 常见问题整理](https://juejin.cn/post/6844904191203213326)

![流程图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6308139c3d224c9a97b05be64612fdf3~tplv-k3u1fbpfcp-zoom-1.image)

- `Workspace`：工作区
- `Index / Stage`：暂存区
- `Repository`：仓库区（或本地仓库）
- `Remote`：远程仓库

###  常见命令

```
# 查看工作区和暂存区的状态
$ git status 
# 将工作区的文件提交到暂存区
$ git add .  
# 提交到本地仓库
$ git commit -m "本次提交说明"
# add和commit的合并，便捷写法（未追踪的文件无法直接提交到暂存区/本地仓库）
$ git commit -am "本次提交说明"  
# 将本地分支和远程分支进行关联
$ git push -u origin branchName 
# 将本地仓库的文件推送到远程分支
$ git push
# 拉取远程分支的代码
$ git pull origin branchName 
# 合并分支
$ git merge branchName 
# 查看本地拥有哪些分支
$ git branch
# 查看所有分支（包括远程分支和本地分支）
$ git branch -a 
# 切换分支
$ git checkout branchName 
# 临时将工作区文件的修改保存至堆栈中
$ git stash
# 将之前保存至堆栈中的文件取出来
$ git stash pop
```



### 常用命令详解

#### add

* `git add .` ：操作的对象是“当前目录”所有文件变更
* `git add -u` ：操作的对象是整个工作区已经跟踪的文件变更，无论当前位于哪个目录下。新文件不会被提交
* `git add -A` ：操作的对象是“整个工作区”所有文件的变更，无论当前位于哪个目录下。

#### reset

* `git reset`：撤销最近一次提交，回退本地修改



### 新建 Git 仓库

#### 本地建再关联

```
# 初始化一个Git仓库
$ git init 
# 关联远程仓库
$ git remote add <name> <git-repo-url>  
# 例如
$ git remote add origin https://github.com/xxxxxx
```

#### 克隆远程

```
# 新建好远程仓库，然后 clone 到本地
$ git clone <git-repo-url>

# 将远程仓库下载到（当前 git bash 启动位置下面的）指定文件中，如果没有会自动生成
$ git clone <git-repo-url> <project-name>
```

