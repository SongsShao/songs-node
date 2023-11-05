---
title: Docker 的安装和使用
permalink: /linux/install/docker.html
date: 2023-11-2 21:24:32
description: 单一的 Promise 链并不能发现 async/await 的优势。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

#### Linux上安装Docker分为以下几步：

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

#### 镜像命令

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

#### 容器命令

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

#### 常用其他命令

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

5. 进入当前正在运行的容器

```shell
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker exec -it 4f9b77aafa46 /bin/bash
  [root@4f9b77aafa46 /]# ps =ef
  UID        PID  PPID  C STIME TTY          TIME CMD
  root         1     0  0 09:42 ?        00:00:00 /bin/sh -c while true;do echo batype;sleep 1000;done
  root        20     1  0 13:19 ?        00:00:00 /usr/bin/coreutils --coreutils-prog-shebang=sleep /usr/bin/sleep 1000
  root        21     0  0 13:30 pts/0    00:00:00 /bin/bash
  root        35    21  0 13:31 pts/0    00:00:00 ps -ef

```

6. 从容器拷贝文件到主机

```shell
  docker cp 容器id:容器内路径 目的主机的路径
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# cd /home/
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# ls
  html
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker ps
  CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS       PORTS     NAMES
  4f9b77aafa46   centos    "/bin/sh -c 'while t…"   4 hours ago   Up 4 hours             tender_hofstadter
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker exec -it 4f9b77aafa46 /bin/bash
  [root@4f9b77aafa46 /]# ls
  bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
  [root@4f9b77aafa46 /]# cd /home/
  [root@4f9b77aafa46 home]# ls
  [root@4f9b77aafa46 home]# touch test.java
  [root@4f9b77aafa46 home]# ls
  test.java
  [root@4f9b77aafa46 home]# exit
  exit
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker ps
  CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS       PORTS     NAMES
  4f9b77aafa46   centos    "/bin/sh -c 'while t…"   4 hours ago   Up 4 hours             tender_hofstadter
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker cp 4f9b77aafa46:/home/test.java /home
  Successfully copied 1.54kB to /home
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# ls
  html  test.java


  # 拷贝是一个手动过程，未来我们使用 -v 卷的技术，可以实现，自动同步（容器内的/home路径和主机上的/home路径打通）
```

#### 练习安装Nginx
1. 搜索镜像：docker search nginx (建议去dockerHub上去搜索)

2. 下载镜像：docker pull nginx

3. 启动镜像

```shell
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker pull nginx
  Using default tag: latest
  latest: Pulling from library/nginx
  Digest:
  sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
  Status: Downloaded newer image for nginx:latest
  docker.io/library/nginx:latest
  # -d 后台运行
  # --name="nginx01"    给容器命名
  # -p 宿主机端口:容器内部端口
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker run -d --name nginx01 -p 515:80 nginx
  614bbf44138a3e834008f5a33a71194c8e78d7f0e53bccbdfc4c9c9f0c0501cb
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# docker ps
  CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                 NAMES
  614bbf44138a   nginx     "/docker-entrypoint.…"   8 seconds ago   Up 7 seconds   0.0.0.0:515->80/tcp, :::515->80/tcp   nginx01
  4f9b77aafa46   centos    "/bin/sh -c 'while t…"   4 hours ago     Up 4 hours                                           tender_hofstadter
```

4. 测试访问

```shell
  # 访问指向端口515
  [root@iZ2vc7kou0oyoo6bt2y0lcZ home]# curl 0.0.0.0:515
  <!DOCTYPE html>
  <html>
  <head>
  <title>Welcome to nginx!</title>
  <style>
  html { color-scheme: light dark; }
  body { width: 35em; margin: 0 auto;
  font-family: Tahoma, Verdana, Arial, sans-serif; }
  </style>
  </head>
  <body>
  <h1>Welcome to nginx!</h1>
  <p>If you see this page, the nginx web server is successfully installed and
  working. Further configuration is required.</p>

  <p>For online documentation and support please refer to
  <a href="http://nginx.org/">nginx.org</a>.<br/>
  Commercial support is available at
  <a href="http://nginx.com/">nginx.com</a>.</p>

  <p><em>Thank you for using nginx.</em></p>
  </body>
  </html>
```

#### 可视化工具
```shell
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker run -d -p 8088:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock --privileged=true portainer/portainer
  Unable to find image 'portainer/portainer:latest' locally
  latest: Pulling from portainer/portainer

  Digest:
    sha256:fb45b43738646048a0a0cc74fcee2865b69efde857e710126084ee5de9be0f3f
  Status: Downloaded newer image for portainer/portainer:latest
  a1b1156666edf6cad33eb299e35f543b823673a97a9756726d1fbc2cc571bc47
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker ps
  CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  a1b1156666ed   portainer/portainer   "/portainer"             8 seconds ago   Up 7 seconds   0.0.0.0:8088->9000/tcp, :::8088->9000/tcp   dreamy_goodall
  614bbf44138a   nginx                 "/docker-entrypoint.…"   8 minutes ago   Up 8 minutes   0.0.0.0:515->80/tcp, :::515->80/tcp         nginx01
  4f9b77aafa46   centos                "/bin/sh -c 'while t…"   4 hours ago     Up 4 hours                                                 tender_hofstadter
```

2. 测试访问

http://www.batype.com:8088/
1. 连接本地Local
![Connect Portainer](https://pic.imgdb.cn/item/6545012dc458853aefeef057.jpg)

2. 进入之的连接页面
![进入之的连接页面](https://pic.imgdb.cn/item/654505fec458853aef03e9b1.jpg)

#### commit镜像

```shell
  # 提交容器成为一个新的副本
  docker commit
  # 命令和git原理类似
  docker commit -m="提交的描述信息" -a="作者" 容器id 目标镜像名:[TAG]
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker commit -a="batype" -m="test" 614bbf44138a nginx001:18.16.0
  sha256:7fcdd59c72c118bccfc2a6d94953e7d18d4a1afadeea0eee304117e917f0aabe
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker images
  REPOSITORY            TAG       IMAGE ID       CREATED          SIZE
  nginx001              18.16.0   7fcdd59c72c1   12 seconds ago   141MB
  nginx                 latest    605c77e624dd   22 months ago    141MB
  mysql                 latest    3218b38490ce   22 months ago    516MB
  centos                latest    5d0da3dc9764   2 years ago      231MB
  portainer/portainer   latest    580c0e4e98b0   2 years ago      79.1MB
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker ps
  CONTAINER ID   IMAGE                 COMMAND                  CREATED             STATUS             PORTS                                       NAMES
  a1b1156666ed   portainer/portainer   "/portainer"             About an hour ago   Up About an hour   0.0.0.0:8088->9000/tcp, :::8088->9000/tcp   dreamy_goodall
  614bbf44138a   nginx                 "/docker-entrypoint.…"   About an hour ago   Up About an hour   0.0.0.0:515->80/tcp, :::515->80/tcp         nginx01
  4f9b77aafa46   centos                "/bin/sh -c 'while t…"   5 hours ago         Up 5 hours                                                     tender_hofstadter
```

### 容器数据卷

#### 什么是容器数据卷？

Docker容器数据卷，即Docker Volume（卷）。

当Docker容器运行的时候，会产生一系列的数据文件，这些数据文件会在关闭Docker容器时，直接消失的。但是其中产生部分的数据内容，我们是希望能够把它给保存起来，另作它用的。

关闭Docker容器=删除内部除了image底层数据的其他全部内容，即删库跑路

所以我们期望：

将应用与运行的环境打包形成容器运行，伴随着容器运行产生的数据，我们希望这些数据能够持久化。
希望容器之间也能够实现数据的共享、

Docker容器产生的数据同步到本地,这样关闭容器的时候，数据是在本地的，不会影响数据的安全性。
docker的容器卷技术也就是将容器内部目录和本地目录进行一个同步，即挂载。

#### 使用数据卷

主机目录和容器内的目录是映射关系

```shell
docker run -it -v 主机目录:容器内目录 镜像名 /bin/bash
# 测试，查看容器信息
docker inspect 容器id
```

![](https://pic.imgdb.cn/item/654510aac458853aef35e748.jpg)

停止容器后，在主机的/home/ceshi文件夹下，修改文件或新增文件，启动容器，查看容器的/home文件夹，发现容器内的数据依旧是同步的

  - 停止容器。
  - 宿主机上修改文件。
  - 启动容器。
  - 容器内的数据依旧是同步的。

#### 安装MySQL

![](https://pic.imgdb.cn/item/65451200c458853aef3c1f3c.jpg)

```shell

  # 获取镜像
  docker pull mysql:5.7
  # 运行容器，需要做数据目录挂载。（安装启动mysql，注意：需要配置密码）
  # 官方启动mysql
  docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my123456 -d mysql:5.7

  # 配置启动并同步数据
  docker run -d -p 8081:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7

```


#### 匿名挂载和具名挂载

```shell

  # 如何确定是具名挂载，还是匿名挂载，还是指定路径挂载
  -v 容器内的路径                # 匿名挂载
  -v 卷名:容器内的路径        # 具名挂载
  -v /宿主机路径:容器内路径    # 指定路径挂载

  # 具名挂载
  [root@iZ2vc7kou0oyoo6bt2y0lcZ mysql]# docker run -d -p 3344:80 --name nginx02 -v juming-nginx:/etc/nginx nginx
  7cd90c3b2f02f9b84e0dd659f0c8179d777b3c9b6c95e11da4db8a7831d0923e
  [root@iZ2vc7kou0oyoo6bt2y0lcZ mysql]# docker volume ls
  DRIVER    VOLUME NAME
  local     cffb5d0a4839c2deff3d4c3fde9b86795632dd3ee42e256daf68fa3a33d888fd
  local     f9515933a80fac5357c7b26742d5870471ae5b21dcef34a79b60e2cc70a4c288
  local     juming-nginx
  # 匿名挂载
  [root@iZ2vc7kou0oyoo6bt2y0lcZ mysql]# docker run -d --name nginx03 -v /etc/nginx nginx
  c27103b64da61544a65037ae16441f2b1ffe6f02ce0729768724752d8c4751f1
  [root@iZ2vc7kou0oyoo6bt2y0lcZ mysql]# docker volume ls
  DRIVER    VOLUME NAME
  local     3303ec682317c64c023983cc615fa0db5cd6a88b77c4f7361d2594bc68618961
  local     cffb5d0a4839c2deff3d4c3fde9b86795632dd3ee42e256daf68fa3a33d888fd
  local     f9515933a80fac5357c7b26742d5870471ae5b21dcef34a79b60e2cc70a4c288
  local     juming-nginx
```
**拓展**

```shell
  # 通过 -v 容器内的路径:ro    rw    改变读写权限
  ro    read only    # 只读
  rw    read write    # 可读可写
  docker run -d -p 3345:80 --name nginx02 -v juming-nginx:/etc/nginx:rw nginx
  docker run -d -p 3345:80 --name nginx02 -v juming-nginx:/etc/nginx:rw nginx

```

#### Dockerfile

dockerfile 就是用来构建 docker 镜像的构建文件。    命令脚本！

通过这个脚本可以生成镜像，镜像是一层一层的，脚本一个一个的命令，每个命令都是一层！

1. 创建一个名为dockerfile 的文件

```shell
  FROM centos
  VOLUME ["volume01", "volume02"]
  CMD echo "-----end-----"
  CMD /bin/bash
```

2. 编译

```shell
  docker build -f ./dockerfile_songs_note -t songs_note.centos:1.0 .
```

![](https://pic.imgdb.cn/item/6545ab56c458853aef9204f3.jpg)

3. 启动容器

```shell
  docker run -it 5f6352c38230 /bin/bash
```

```shell
# 图形选中的就是匿名挂载
VOLUME ["volume01", "volume02"]

```

![](https://pic.imgdb.cn/item/6545ac56c458853aef949ef9.jpg)

4. 查看一下卷挂载的路径：docker inspect 容器id

```shell
  docker inspect 95ab48f7bf47
```

![](https://pic.imgdb.cn/item/6545ad0ac458853aef967f53.jpg)

#### 数据卷容器

多个容器同步数据（临时认父）

将两个容器或者更多容器之间的数据进行数据共享

1. 启动3个容器

```shell
  docker run -it -d --name docker01 songs_note.centos:1.0
  # 进入容器创建test.js 文件
  docker run -it -d --name docker02 --volumes-from docker01 songs_note.centos:1.0
  # 进入容器创建test1.js 文件
  docker run -it -d --name docker03 --volumes-from docker01 songs_note.centos:1.0
  # 进入容器创建test2.js 文件

  # 进入 容器docker01查看
  [root@ab2fb91dd8c5 volume01]# ls
  test.js  test1.js  test2.js

  # 删除某一个容器
   [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker rm -f f0305bd4a916
  # 查看其他容器文件是否还在
  [root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker exec -it 1c7a3dbaf54e /bin/bash
  [root@1c7a3dbaf54e /]# cd volume01
  [root@1c7a3dbaf54e volume01]# ls
  test.js  test1.js  test2.js
```

2. 多个mysql实现数据共享

```shell

[root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker run -d -p 7777:3306 -v /home/mysql/conf:/etc mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7
[root@iZ2vc7kou0oyoo6bt2y0lcZ ~]# docker run -d -p 7777:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql02 --volumes-from mysql01 mysql:5.7

```

**结论**：
容器之间配置信息的传递，数据卷容器的生命同期一直持续到没有容器使用为止。
但是一旦你持久化到了本地，这个时候，本地的数据是不会删除的！

### DockerFile

#### 什么是DockerFile ？
dockerfile是用来构建docker镜像的文件！命令参数脚本！

**构建步骤**：
1. 编写一个dockerfile文件
2. docker build 构建成为一个镜像
3. docker run运行镜像
4. docker push发布镜像（DockerHub、阿里云镜像仓库！）

#### 搭建步骤

1. 每个保留关键字（指令）都是必须是大写字母
2. 执行从上到下顺序执行
3. '#' 表示注释
4. 每一个指令都会创建提交一个新的镜像层，并提交！

dockerfile是面向开发的，我们以后要发布项目，做镜像，就需要编写dockerfile文件，这个文件十分简单！

DockerFile：构建文件，定义了一切的步骤，源代码。
Dockerlmages：通过DockerFile构建生成的镜像，最终发布和运行的产品。
Docker容器：容器就是镜像运行起来提供服务的。

#### DockerFile的命令

```shell
  FROM         # 基础镜像，一起从这里开始构建
  MAINTAINER   # 镜像作者：姓名-邮箱
  RUN          # 镜像构建的时候需要运行的命令
  ADD          # 步骤：tomcat镜像，这个tomcat压缩包！添加内容
  WORKDIR      # 镜像的工作目录
  VOLUME       # 挂载的目录
  EXPOSE       # 暴露端口配置
  CMD          # 指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代
  ENTRYPOINT   # 指定这个容器启动的时候要运行的命令，可以追加命令
  ONBUILD      # 当构建一个被继承DockerFile 这个时候就会运行ONBUILD 的指令，触发指令。
  CPOY         # 类似ADD，将我们的文件拷贝到镜像中
  ENV          # 构建的时候设置环境变量！
```

#### 测试

1. 编写dockerfile的文件

```DockerFile
  FROM centos:latest
  MAINTAINER batye<1175715363@qq.com>
  ENV MYPATH /usr/local
  WORKDIR $MYPATH
  RUN yum -y install vim
  RUN yum -y install net-tools
  EXPOST 8001
  CMD echo $MYPATH
  CMD echo "----end----"
  CMD /bin/bash
```

2. 构建文件镜像

```shell
  docker build -f dockerFile_test -t vim.centos:0.0.1 .
```

3. 原生contos7

```shell
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# docker run -it centos
  [root@566d6bd3f48d /]# pwd
  /
  # 工作目录为根目录
  [root@566d6bd3f48d /]# vim
  bash: vim: command not found
  # 没有vim 工具
  [root@566d6bd3f48d /]# exit
  exit
```

4. vim.centos增加配置以后的镜像

```shell
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# docker run -it vim.centos:0.0.1
  [root@53bfee4c6557 local]# pwd
  /usr/local
  [root@53bfee4c6557 local]# vim

  [root@53bfee4c6557 local]# ifconfig
  eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
          inet 172.17.0.5  netmask 255.255.0.0  broadcast 172.17.255.255
          ether 02:42:ac:11:00:05  txqueuelen 0  (Ethernet)
          RX packets 8  bytes 656 (656.0 B)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 0  bytes 0 (0.0 B)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

  lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
          inet 127.0.0.1  netmask 255.0.0.0
          loop  txqueuelen 1000  (Local Loopback)
          RX packets 0  bytes 0 (0.0 B)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 0  bytes 0 (0.0 B)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

  [root@53bfee4c6557 local]# exit
  exit
```

5. 列出本地进行的变更历史

```shell
  docker history 692aba72d901
```

![docker history 692aba72d901](https://pic.imgdb.cn/item/6545f262c458853aef77e132.jpg)


6. CMD和ENTRYPOINT区别

```shell
  CMD            # 指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代
  ENTRYPOINT     # 指定这个容器启动的时候要运行的命令，可以追加命令
```

  - 测试CMD
```shell
  # 1. 编写dockerfile文件
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# vim dockerfile-cmd-test
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# cat dockerfile-cmd-test
  FROM centos:7
  CMD ["ls","-a"]
  # 2. 构建镜像
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# docker build -f dockerfile-cmd-test -t cmdtest .
  # 3. run运行，发现我们的"ls -a"命令生效、执行
  docker run 06f2cc65ea4a
```
```shell
  docker run 06f2cc65ea4a 
```
  ![docker run 06f2cc65ea4a ](https://pic.imgdb.cn/item/6545f420c458853aef7e35a4.jpg)
```shell
  # 4. 我们先追加一个命令"l",构成"ls -al"命令，发现报错
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# docker run ec0d2dd226b3 -l
  docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: exec: "-l": executable file not found in $PATH: unknown.
  ERRO[0000] error waiting for container:
  # 原因：CMD命令的情况下，"-l"替换了CMD["1s"，"-a"]命令，因为"-l"不是命令，所以报错！
```

  - 测试ENTRYPOINT
```shell
  # 1. 编写dockerfile文件
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# vim dockerfile-entrypoint-test
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# cat dockerfile-entrypoint-test
  FROM centos:7
  ENTRYPOINT ["ls","-a"]
  # 2. 构建镜像
  [root@iZ2vc7kou0oyoo6bt2y0lcZ dockerfile]# docker build -f dockerfile-entrypoint-test -t entrypointtest .
  # 3. run运行，发现我们的"ls -a"命令生效、执行
  docker run 5184c7d459a0
```
![docker run 5184c7d459a0](https://pic.imgdb.cn/item/6545fc1bc458853aef99f91e.jpg)
```shell
  docker run 5184c7d459a0 -l
```
![docker run 5184c7d459a0 -l](https://pic.imgdb.cn/item/6545fb94c458853aef982c74.jpg)
```shell
  # 原因：ENTRYPOINT命令的情况下，"-l"追加在ENTRYPOINT ["1s"，"-a"]命令后面，得到"ls -al"的命令，所以命令正常执行！
  # （我们的追加命令，是直接拼接在我们的ENTRYPOINT命令的后面）
```
