---
title: CentOS上安装Nginx
permalink: /linux/install/nginx.html
date: 2023-12-19 23:18:25
description: 
tag: [linux, nginx]
comments: true
categories: 
 - linux
 - nginx
---

要在CentOS上安装Nginx，您可以按照以下步骤进行操作：

打开终端或SSH连接到CentOS服务器。

确保您的系统已经更新到最新版本。运行以下命令更新软件包：

```shell
    sudo yum update
```

安装Nginx。运行以下命令进行安装：

```shell
    sudo yum install nginx
```

启动Nginx服务：

使用以下命令启动Nginx服务：

```shell
    sudo systemctl start nginx
```

检查Nginx状态：

使用以下命令检查Nginx服务的状态：

```shell
    sudo systemctl status nginx
```

如果Nginx正在运行，您将看到"active (running)"状态。

添加到开机启动项：

要使Nginx在系统启动时自动启动，可以使用以下命令将其添加到开机启动项：

```shell
    sudo systemctl enable nginx
```

现在，Nginx将在系统启动时自动启动。您可以通过重新启动服务器并检查Nginx状态来验证设置是否成功。请注意，上述命令假定您具有适当的权限（如sudo）来执行这些操作。
