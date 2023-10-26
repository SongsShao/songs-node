---
title: nvm 管理node版本
permalink: /web/npm/nvm.html
date: 2023-10-25 15:47:01
description: nvm -- Node version manager。

tag: [前端, npm, nvm]
comments: true
categories: 
 - 前端
 - npm
---

#### Windows 上安装

[nvm_github](https://github.com/nvm-sh/nvm)

1. 点击 "Code" 按钮，然后选择 "Download ZIP" 下载 ZIP 文件。
2. 解压缩 ZIP 文件：解压缩下载的 ZIP 文件，将解压后的文件夹放在您想要安装 NVM 的位置。
3. 配置环境变量：打开命令提示符或 PowerShell，并运行以下命令来配置 NVM 的环境变量：

```shell
    setx NVM_HOME "解压缩文件夹的完整路径"
    setx NVM_SYMLINK "解压缩文件夹的完整路径"
```

#### Linux 上安装

1. 下载 NVM 安装脚本：打开终端并运行以下命令下载 NVM 安装脚本：

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

这将从 NVM GitHub 存储库下载并运行安装脚本。

2. 配置 NVM 环境变量：安装脚本运行后，会将 NVM 相关的路径和初始化脚本添加到您的个人配置文件（如 ~/.bashrc、~/.zshrc 等）。要使这些更改生效，可以运行以下命令：

```shell
source ~/.bashrc
```

如果您使用的是其他 Shell，替换 ~/.bashrc 为您实际使用的配置文件。

#### 验证安装

```shell
nvm --version
```

#### 安装node.js 版本

```shell
nvm install <version>
```

**例如**

```shell
nvm install 16.13.0
```

安装成功后，NVM 会自动将该版本设置为默认版本。

#### 切换版本

切换 Node.js 版本：如果您有多个安装的 Node.js 版本，可以使用以下命令切换不同的版本：

```shell
nvm use <version>
```

**例如**

```shell
nvm use 18.16.0
```

这将将您的当前 Shell 会话设置为使用指定的 Node.js 版本。

#### 查询当前版本

```shell
nvm use node
```

#### 查询当前node路径

```shell
nvm which 18.16.0
/Users/shaosong/.nvm/versions/node/v18.16.0/bin/node
```

#### listing Version

```shell
nvm ls
```

#### 设置默认version

```shell
nvm alias default 18.16.0
```

现在，您已经在 Linux 上成功安装了 NVM。您可以使用 nvm use 命令切换不同的 Node.js 版本，并使用 node 和 npm 命令来管理您的 Node.js 环境。
