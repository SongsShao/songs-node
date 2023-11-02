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

https://blog.csdn.net/qq_54729417/article/details/127913536?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169893726416800188573112%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169893726416800188573112&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-127913536-null-null.142^v96^pc_search_result_base1&utm_term=docker%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B&spm=1018.2226.3001.4187