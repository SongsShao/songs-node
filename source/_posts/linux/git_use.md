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

5. 分支管理：Git 使用分支来管理不同的版本和功能。可以使用以下命令创建和切换分支：

- 创建新分支：

```shell
    git branch <分支名>
```

- 切换到分支：

```shell
    git checkout <分支名>
```

- 查看分支列表：

```shell
    git branch
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

- 从远程仓库拉取最新代码：

```shell
    git pull origin <分支名>
```

这些是 Git 的基本用法，还有更多高级的用法和命令可以根据实际需要进行学习和掌握。你可以参考 Git 的官方文档或查找其他教程来深入了解 Git 的更多功能和用法。

7. 配置全局用户信息

```shell
    git config --global user.name "batype"
    git config --global user.email 1175715363@qq.com
```
