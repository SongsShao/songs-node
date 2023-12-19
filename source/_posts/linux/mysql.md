---
title: MySQL linux install
permalink: /linux/install/MySQL.html
date: 2023-12-19 23:14:19
description: 在线下载mysql安装包
tag: [linux, mysql]
comments: true
categories: 
 - linux
 - mysql
---

在线下载mysql安装包

```shell
wget https://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
```

安装MySQL

```shell
yum -y install mysql57-community-release-el7-10.noarch.rpm
```

安装MySQL服务器

```shell
yum -y install mysql-community-server
```

报错 失败的软件包是： mysql-community-libs-compat-5.7.37-1.el7.x86_64 
GPG 密钥配置为： file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql 
解决办法：原因是Mysql的GPG升级了，需要重新获取
使用以下命令即可

```shell
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

重新执行

```shell
yum -y install mysql-community-server
```

安装完毕
启动Mysql服务

```shell
systemctl start  mysqld.service
```

修改mysql的密码
查看MySQL临时密码

```shell
grep "password" /var/log/mysqld.log
```


使用临时密码先登录

```shell
mysql -u root -p
```

注意:密码设置必须要大小写字母数字和特殊符号（,/';:等）,不然不能配置成功
查看mysql默认密码复杂度

```shell
SHOW VARIABLES LIKE 'validate_password%';
```

把MySQL的密码校验强度改为低风险

```shell
set global validate_password_policy=LOW;
```

修改MySQL的密码长度

```shell
set global validate_password_length=4;
```

修改密码为root

```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
```

开启mysql远程访问

```shell
grant all privileges on *.* to 'root'@'%' identified by 'root' with grant option;
```

1、使用 grant 命令

```shell
grant all privileges on 数据库名.表名 to 创建的用户名(root)@"%" identified by "密码";
```

2、格式说明：
数据库名.表名 如果写成*.*代表授权所有的数据库
@ 后面是访问mysql的客户端IP地址（或是 主机名） % 代表任意的客户端，如果填写 localhost 为本地访问（那此用户就不能远程访问该mysql数据库了）

```shell
flush privileges; //刷新权限
```

退出mysql

```shell
exit;
```

为firewalld添加开放端口

```shell
firewall-cmd --zone=public --add-port=3306/tcp --permanent  //开放端口
firewall-cmd --reload  //重新加载防火墙
```

其他配置
关闭MySQL

```shell
systemctl stop mysqld
```

重启MySQL

```shell
systemctl restart mysqld
```

查看MySQL运行状态

```shell
systemctl status mysqld
```

设置开机启动

```shell
systemctl enable mysqld
```

关闭开机启动

```shell
systemctl disable mysqld
```

配置默认编码为utf8

```shell
vi /etc/my.cnf
在[mysqld]中加入 character_set_server=utf8 

```

区分大小写

/etc/my.cof

```
lower_case_table_names=1
```

其他默认配置文件路径：
配置文件： /etc/my.cnf 
日志文件： /var/log/mysqld.log 
服务启动脚本： /usr/lib/systemd/system/mysqld.service