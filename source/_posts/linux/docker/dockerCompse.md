---
title: docker-compose install
permalink: /linux/install/docker-compose.html
date: 2023-11-13 10:36:03
description: ubantu use wechat, 使用的是模拟window环境打开wechat。
tag: [前端, linux, docker-compose]
comments: true
categories: 
 - linux
 - docker-compose
---

### Curl 下载

```shell
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 修改权限

```shell
    chmod +x /usr/local/bin/docker-compose
```

### 查询版本

```shell
    docker-compose --version
```

### 运行

需要将运行yml 命名为 docker-compose.yml

```shell
    docker-compose up -d
```
