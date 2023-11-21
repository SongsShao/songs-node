---
title: ubantu use wechat
permalink: /linux/install/wechat.html
date: 2023-11-11 12:24:32
description: ubantu use wechat, 使用的是模拟window环境打开wechat。
tag: [前端, linux, wechat]
comments: true
categories: 
 - linux
 - wechat
---

### 安装Docker

```shell
    sudo apt install docker.io
```

### 拉取镜像

```shell
    docker pull bestwu/wechat
```

### 允许所有用户访问图形界面

```shell
    xhost +
```

注意，这条命令可能会提示：

```shell
    access control disabled, clients can connect from any host
```

看到这样的提示信息，表示命令执行成功，不是什么报错信息。

### 创建Docker容器

```shell
    docker run -d --name wechat\
        --device /dev/snd\
        --ipc=host\
        -v /tmp/.X11-unix:/tmp/.X11-unix\
        -v /home/batype/WeChatFiles:/WeChatFiles\
        -v /home/batype:/batype\
        -e DISPLAY=unix$DISPLAY\
        -e XMODIFIERS=@im=fcitx\
        -e QT_IM_MODULE=fcitx\
        -e GTK_IM_MODULE=fcitx\
        -e GID=`id -g`\
        -e UID=`id -u`\
        bestwu/wechat
```

注意！注意！注意！上述代码不能直接使用，需要一定的修改！！！

- 将代码中的batype改成自己的用户名！！！

- 如果你是ibus输入法，将代码中的fcitx改成ibus！！！

### 等待微信启动
注意！！！当你执行完docker run之后，大约需要等待1-2分钟后，才会弹出微信的登录窗口。一定要有信心，有耐心，不要放弃，要耐心等待1-2分钟！

等待完成后，即可看到微信的登录界面，扫码登录即可尽情使用！

### 常见问题

#### 微信的字体特别小
安装完 Docker 微信后，字特别小，根本看不清，太费眼睛。

解决方法：

1. 进入容器内部

```shell
    docker exec -it wechat bash
```

2. 切换到wechat用户（此步骤不可省略，否则下面的步骤无法进行！！！）

```shell
    su wechat
```
3. 打开配置

```shell
    WINEPREFIX=~/.deepinwine/Deepin-WeChat/ deepin-wine winecfg
```
4. 在弹出窗口中，打开“显示”选项卡，找到最下面“屏幕分辨率”，改成200dpi即可。

#### 运行微信之后，出现一个wine system tray的小窗口

这是wine的系统栏，是正常现象，其实可以把那个窗口关掉，没什么影响。

#### 我不小心把微信的窗口叉掉了，怎么办
执行下面命令即可：

```shell
    docker restart wechat -t 0
```

#### 无法输入中文

这是因为你使用的是ibus输入法，而你未将启动命令中的ibus改成fcitx。

#### 播放视频没有声音

首先删掉容器

```shell
docker rm -f wechat
```

然后重新运行一个

```shell
docker run -d --name wechat\
    --device /dev/snd\
    --ipc=host\
    -v /tmp/.X11-unix:/tmp/.X11-unix\
    -v /home/batype/WeChatFiles:/WeChatFiles\
    -v /home/batype:/batype\
    -e DISPLAY=unix$DISPLAY\
    -e XMODIFIERS=@im=fcitx\
    -e QT_IM_MODULE=fcitx\
    -e GTK_IM_MODULE=fcitx\
    -e AUDIO_GID=`getent group audio | cut -d: -f3`\
    -e GID=`id -g`\
    -e UID=`id -u`\
    bestwu/wechat
```
注意，加了这一行

```shell
-e AUDIO_GID=`getent group audio | cut -d: -f3`\
```

这样的话，播放视频就有声音了。

