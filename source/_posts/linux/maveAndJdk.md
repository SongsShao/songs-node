---
title: ubantu 安装Maven 和jdk 步骤
permalink: /linux/install/maven/jdk.html
date: 2023-11-13 15:35:10
description: To install Maven and JDK (Java Development Kit) on Ubuntu, you can follow these steps。
tag: [前端, linux, maven, jdk]
comments: true
categories: 
 - linux
 - maven
---

To install Maven and JDK (Java Development Kit) on Ubuntu, you can follow these steps:

Open a terminal on your Ubuntu system.

Update the package lists by running the following command:

```shell
    sudo apt update
```

Install Maven by running the following command:

```shell
    sudo apt install maven
```

This will install Maven and its dependencies.

Verify the installation by running the following command:

```shell
    mvn --version
```

This should display the version of Maven installed on your system.

Install JDK (Java Development Kit) using the following steps:

a. Check if Java is already installed on your system by running the following command:

```shell
    yum list installed | grep java
    或者
    java -version
```

If Java is not installed, you will see an error message.

b. select yum list package version

```shell
    yum search java | grep -i --color jdk
```

c. Install the default JDK package by running the following command:

```shell
    yum install java-1.8.0-openjdk.x86_64
    or
    sudo apt install default-jdk
```

This will install the default JDK package available in the Ubuntu package repository.

d. Verify the installation by running the following command:

```shell
    javac -version
```

This should display the version of the JDK installed on your system.

Additionally, you can also run the following command to check the Java Runtime Environment (JRE) version:

```shell
    java -version
```

This will display the JRE version.

e. jdk checkout version link

```shell
    sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-1.8.0-openjdk-amd64/bin/java 1
    sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-1.8.0-openjdk-amd64/bin/javac 1
```

f. use shell checkout version

```shell
    sudo update-alternatives --config java
    有 3 个候选项可用于替换 java (提供 /usr/bin/java)。

    选择       路径                                          优先级  状态
    ------------------------------------------------------------
    * 0            /usr/lib/jvm/java-17-openjdk-amd64/bin/java      1711      自动模式
    1            /usr/lib/jvm/java-1.8.0-openjdk-amd64/bin/java   1         手动模式
    2            /usr/lib/jvm/java-17-openjdk-amd64/bin/java      1711      手动模式
    3            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      手动模式

    要维持当前值[*]请按<回车键>，或者键入选择的编号：1
```


That's it! You have now installed Maven and JDK on your Ubuntu system. You can use Maven for building projects and the JDK for developing and running Java applications.