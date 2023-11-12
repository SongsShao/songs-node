---
title: Ubuntu解压Zip文件命令详解
permalink: /linux/use/zip.html
date: 2023-11-12 19:22:59
description: Ubuntu解压Zip文件的命令是“unzip”，它可以解压几乎所有的Zip文件。。
tag: [linux, zip]
comments: true
categories: 
 - linux
 - zip
---


### 基本介绍
Ubuntu解压Zip文件的命令是“unzip”，它可以解压几乎所有的Zip文件。其基本的语法为：

```shell
    unzip [option] filename.zip
```

其中，filename.zip表示要解压的Zip文件名，option参数是可选的，用来控制解压的行为，常用的option参数如下：

```shell
    -d：指定解压到的目录，例如：unzip -d /home/user/untitled filename.zip，即将filename.zip解压到/home/user/untitled目录；
    -q：不显示详细信息，即不显示每个文件的解压进度信息；
    -o：覆盖目标文件，即如果目标文件存在就覆盖它；
    -P：指定Zip文件的密码。
```

### 解压Zip文件到当前路径

解压一个Zip文件到当前路径很简单，只要在终端中输入“unzip filename.zip”即可。比如：

```shell
    unzip archive.zip
```

上述命令将会将“archive.zip”文件解压到当前路径中。如果你希望将Zip文件解压到另外一个路径，可以使用“-d”参数，如下所示：

```shell
    unzip archive.zip -d /home/user/some_folder
```

上述命令将会将“archive.zip”文件解压到“/home/user/some_folder”路径中。

### 解压指定的文件
有时候我们只需要解压Zip文件中的某些文件，而不是全部文件，这时候可以使用“unzip -j”命令。

```shell
    unzip -j archive.zip file.txt
```

上述命令将会将“archive.zip”文件中的“file.txt”文件解压到当前路径中。

### 解压时覆盖已存在的文件

默认情况下，如果解压的目标文件已经存在，unzip命令会提示是否覆盖。如果你希望不进行提示，强制覆盖已经存在的文件，可以使用“-o”参数。

```shell
    unzip -o archive.zip
```

上述命令将会解压“archive.zip”文件到当前路径中，如果有重名的文件会强制覆盖。

### 解压时保留目录结构
默认情况下，unzip命令会将Zip文件中的所有文件解压到当前路径中，不管其原来所在的目录结构。如果你希望保留原来的目录结构，可以使用“unzip -j”命令，如下所示：

```shell
unzip archive.zip -d /home/user/some_folder
```

上述命令将会将“archive.zip”文件解压到“/home/user/some_folder”路径中，并保留原来的目录结构。

### 解压时指定密码

如果Zip文件设置了密码，那么我们需要在解压时指定密码。

```shell
unzip -P secretPassword archive.zip
```
上述命令将会解压“archive.zip”文件，并使用“secretPassword”作为密码。