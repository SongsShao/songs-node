---
title: Docker 安装Redis
permalink: /linux/docker/redis.html
date: 2023-11-22 21:24:32
description: Docker 安装Redis,并且进行数据和配置文件同步，以及密码修改。
tag: [前端, linux, docker， redis]
comments: true
categories: 
 - linux
 - docker
 - redis
---

### 下载redis 镜像

```shell
    docker pull redis
```

### 启动镜像并同步数据

```shell
    docker run -itd --name redis -p 6379:6379 \
     --restart=always \
     -v /home/xt/redis/redis.conf:/etc/redis/redis.conf \
     -v /home/xt/redis/data:/data \
     redis redis-server /etc/redis/redis.conf
```

### 添加密码

#### 进入容器

```shell
    docker exec -it 04f824eaf3800958615a9874084ea6d57ab346cd61723a1eb54074a9477f1efe /bin/bash
```

在Redis命令行中，我们可以使用config set命令来设置Redis的密码。以下是设置密码的代码和注释。

```shell
    config set requirepass your_password
```

### 重启Redis容器

完成上述步骤后，我们需要重启Redis容器使密码生效。可以使用以下命令重启Redis容器。

```shell     
docker restart 04f824eaf3800958615a9874084ea6d57ab346cd61723a1eb54074a9477f1efe
```