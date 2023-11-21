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
    java -version
```

If Java is not installed, you will see an error message.

b. Install the default JDK package by running the following command:

```shell
    sudo apt install default-jdk
```

This will install the default JDK package available in the Ubuntu package repository.

c. Verify the installation by running the following command:

```shell
    javac -version
```

This should display the version of the JDK installed on your system.

Additionally, you can also run the following command to check the Java Runtime Environment (JRE) version:

```shell
    java -version
```

This will display the JRE version.

That's it! You have now installed Maven and JDK on your Ubuntu system. You can use Maven for building projects and the JDK for developing and running Java applications.