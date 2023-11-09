---
title: vscode . open project
permalink: /linux/use/vscode/open/project.html
date: 2023-11-09 17:01:53
description: You are trying to start Visual Studio Code as a super user which isn't recommended. If this was i...
tag: [linux, vscode]
comments: true
categories: 
 - linux
 - vscode
---

You are trying to start Visual Studio Code as a super user which isn't recommended. If this was i...

在centos7 中通过wget 安装vscode(tar.gz格式)后，执行/bin/code出现提示：

You are trying to start Visual Studio Code as a super user which isn't recommended. If this was intended, please add the argument --no-sandbox and specify an alternate user data directory using the --user-data-dir argument.
您正试图以超级用户身份启动Visual Studio代码，这是不推荐的。如果是这样，请添加参数“--no sandbox”，并使用“--user data dir”参数指定备用用户数据目录。

解决方法：
方法一：修改 ~/.bashrc
```shell
    vi ~/.bashrc
```

添加一行
```shell
    whereis code 
    # code: /usr/bin/code /usr/share/code
    alias code='/usr/share/code/code . --no-sandbox --unity-launch'
```



```shell
    source ~/.bashrc
```
