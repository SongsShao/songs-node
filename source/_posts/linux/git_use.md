---
title: Git 使用
permalink: /linux/config/git.html
date: 2023-11-7 21:40:32
description: Git 是一个分布式版本控制系统，用于跟踪文件的变化并协作开发。
tag: [前端, Git, linux]
comments: true
categories: 
 - linux
 - git
---

Git 是一个分布式版本控制系统，用于跟踪文件的变化并协作开发。以下是使用 Git 的基本步骤：

1. 安装 Git：首先，你需要在本地计算机上安装 Git。你可以从 Git 官方网站（<https://git-scm.com/）下载并按照安装指南进行安装。>

2. 创建一个 Git 仓库：进入你的项目文件夹，并使用以下命令初始化一个新的 Git 仓库：

```shell
    git init
```

3. 添加文件到暂存区：将需要进行版本控制的文件添加到 Git 的暂存区，使用以下命令：

```shell
    git add <文件名>
```

4. 提交文件：将暂存区的文件提交到 Git 仓库，使用以下命令：

```shell
    git commit -m "提交说明"
```

5. 分支管理：

Git 使用分支来管理不同的版本和功能。可以使用以下命令创建、切换、合并、暂存、还原暂存分支：

```shell
    git branch          <分支名>        # 创建新分支
    git checkout        <分支名>        # 切换到分支
    git checkout -b     <分支名>        # 基于当前分支创建分支
    git merge           <分支名>        # 合并分支
    git branch                         # 查看分支列表
    git stash    save   ''             # 暂存分支
    git stash    pop                   # 恢复暂存：
                                       # 恢复暂存的修改 这个指令将缓存堆栈中的第一个stash删除，并将对应修改应用到当前的工作目录下。
```

6. 远程仓库：Git 还提供了远程仓库的功能，可以将本地仓库与远程仓库进行同步和协作。常用的远程仓库服务有 GitHub、GitLab 和 Bitbucket。可以使用以下命令与远程仓库进行交互：

- 添加远程仓库：

```shell
    git remote add origin <远程仓库地址>
```

- 将本地分支推送到远程仓库：

```shell
    git push -u origin <分支名>
```
- 将本地代码强制推送到远程仓库：

```shell
    git push -f || -force origin <分支名>
```

- 从远程仓库拉取最新代码：

```shell
    git pull origin <分支名>
```

这些是 Git 的基本用法，还有更多高级的用法和命令可以根据实际需要进行学习和掌握。你可以参考 Git 的官方文档或查找其他教程来深入了解 Git 的更多功能和用法。

7. 回退版本

git reset 命令用于回退版本，可以指定退回某一次提交的版本。git reset 命令语法格式如下：

```shell
    git reset [--soft | --mixed | --hard] [HEAD]
```

- --mixed

为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。

```shell
    git reset HEAD^                  # 回退所有内容到上一个版本
    git reset HEAD^ git_use.md       # 回退文件的版本到上一个版本
    git reset 0123adsfe3             # 回退到指定版本
```


- --hard 

参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交：

```shell
    git reset --hard HEAD             # 回退所有内容到上一个版本
    git reset --hard HEAD~3           # 回退上上上一个版本
    git reset –hard bae128            # 回退到某个版本回退点之前的所有信息
    git reset --hard origin/master    # 将本地的状态回退到和远程的一样

```

8. 删除本地和远程分支

```shell
    git branch  -d         <分支名>    # 删除本地
    git push    origin -d  <分支名>    # 删除远程分支
```

9. 配置全局用户信息

```shell
    git config --global user.name   "batype"
    git config --global user.email  1175715363@qq.com
```

10. 避免每次推送都输入密码

```shell
    git config --global credential.helper store
```