---
title: Linux docker install
permalink: /linux/install/docker.html
date: 2023-11-2 21:24:32
description: 单一的 Promise 链并不能发现 async/await 的优势。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

### Linux上安装Docker分为以下几步：

1. 设置存储库。

```shell
sudo yum install -y yum-utils

sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

```

2. 安装Docker引擎

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```

3. 启动Docker

```shell
sudo systemctl start docker
```

4. 设置docker开机自启动

```shell
sudo systemctl enable docker
```

5. 配置镜像加速器

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://om7zpa5s.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 镜像命令

1. 查看

```shell
docker images
```

2. 搜索镜像

```shell
docker search mysql
```

3. 下载镜像

```shell
docker pull mysql:version
```

4. 删除镜像

```shell
  docker images // 查看image ID

  docker rmi -f feb5d9fea6a5
  # 多个删除
  docker rmi -f feb5d9fea6a5 feb5d9fea6a5 
  docker rmi -f $(docker images -aq)    # 删除全部的镜像
```

### 容器命令

1. 新建容器并启动

```shell
  docker run -it centos /bin/bash

```

2. 列出所有运行的容器

```shell
  docker ps 
  # 命令参数可选项
  -a        # 列出当前正在运行的容器+历史运行过的容器
  -n=?    # 显示最近创建的容器（可以指定显示几条，比如-n=1）
  -q        # 只显示容器的编号

```

3. 退出容器

```shell
exit        # 容器直接停止，并退出
ctrl+P+Q    # 容器不停止，退出
```

4. 删除容器

```shell
  docker rm 容器id                    # 删除容器（不能删除正在运行的容器）如果要强制删除：docker rm -f 容器id
  docker rm -f $(docker ps -aq)        # 删除全部容器
  docker ps -a -q|xargs docker rm        # 删除所有容器
  docker rm 656c03b3be05
```

5. 启动和停止容器的操作

```shell
  docker start 容器id # 启动容器
  docker restart 容器id # 重启
  docker stop 容器id # 停止
  docker kill 容器id # 强制停止

```

### 常用其他命令

1. 后台启动容器

```shell
  docker run -d centos
```

2. 查看日志

```shell
  docker logs -tf 5694d2fc0a88

  docker run -d centos /bin/sh -c "while true;do echo batype;sleep 1000;done"
```

3. 查看容器中的进程

```shell
  docker ps
  CONTAINER ID   IMAGE     COMMAND                   CREATED         STATUS         PORTS     NAMES
  4f9b77aafa46   centos    "/bin/sh -c 'while t…"   6 seconds ago   Up 5 seconds             tender_hofstadter

  docker top 4f9b77aafa46
  UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
  root                14087               14066               0                   17:42               ?                   00:00:00            /bin/sh -c while true;do echo batype;sleep 1000;done
  root                14107               14087               0                   17:42               ?                   00:00:00            /usr/bin/coreutils --coreutils-prog-shebang=sleep /usr/bin/sleep 1000
```

4. 查看镜像的元数据

```shell
  docker inspect 4f9b77aafa46
  [
      {
          "Id": "4f9b77aafa469b2e50ca296515d66b841f60f12343b1a45ddbdd09766e103d0f",
          "Created": "2023-11-03T09:42:35.034147379Z",
          "Path": "/bin/sh",
          "Args": [
              "-c",
              "while true;do echo batype;sleep 1000;done"
          ],
          "State": {
              "Status": "running",
              "Running": true,
              "Paused": false,
              "Restarting": false,
              "OOMKilled": false,
              "Dead": false,
              "Pid": 14087,
              "ExitCode": 0,
              "Error": "",
              ...
          }
          ...
      }
      ...
  ]
```

https://blog.csdn.net/qq_54729417/article/details/127913536?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169893726416800188573112%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169893726416800188573112&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-127913536-null-null.142^v96^pc_search_result_base1&utm_term=docker%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B&spm=1018.2226.3001.4187