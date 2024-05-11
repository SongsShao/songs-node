---
title: Acme 证书
permalink: /linux/cert/acme.html
date: 2024年05月11日17:15:29
description: cme.sh 是一个纯 Unix Shell 脚本，用于从证书颁发机构（如 Let’s Encrypt）自动获得 SSL/TLS 证书。
tag: [nginx, linux, cert]
comments: true
categories: 
 - linux
 - nginx
---

acme.sh 是一个纯 Unix Shell 脚本，用于从证书颁发机构（如 Let's Encrypt）自动获得 SSL/TLS 证书。它实现了 ACME 协议并支持多种 DNS 服务商解析，包括阿里云（Alibaba Cloud）。

如果你想要使用 acme.sh 来签发一个使用阿里云 DNS 解析的域名的 SSL 证书，可以按照以下步骤操作：

在使用之前，确保您已经在系统上安装了 acme.sh。如果尚未安装，可以使用以下命令进行安装：

### 安装Acme

```sh
curl https://get.acme.sh | sh -s email=abc@gmail.com
```

配置环境变量

```sh
# ~/.zshrc
alias acme.sh=~/.acme.sh/acme.sh
```

### 配置阿里云的 API 密钥

登录阿里云控制台并在 [RAM](https://ram.console.aliyun.com/overview) 登录到阿里云控制台，在 RAM（资源访问管理）中创建一个具有 AliyunDNSFullAccess 权限的 RAM 用户，以便 acme.sh 可以通过API修改DNS记录。记录下AccessKeyId和AccessKeySecret。

在终端中配置阿里云的API密钥。将 YourAccessKeyID 和 YourAccessKeySecret 替换为实际的ID和密钥：
然后将这些密钥配置在环境变量`account.conf`中：

```sh
export Ali_Key="YourAccessKeyID"
export Ali_Secret="YourAccessKeySecret"
```

### 使用 `acme.sh` 生成证书

执行以下命令为 `ai.test.com` 域名签发证书：

```sh
acme.sh --issue --dns dns_ali -d ai.test.com
```

此步骤 `acme.sh` 会自动调用阿里云的 API，在 DNS 记录中添加 ACME 验证记录以证明域名的所有权。

### 安装证书至 Nginx 配置目录

一旦证书成功生成，使用下面的命令将证书和密钥安装到指定的路径，并设置权限：

```sh
acme.sh --install-cert -d ai.test.com \
    --key-file       /etc/nginx/cert/ai.test.com/ai.test.com.key \
    --fullchain-file /etc/nginx/cert/ai.test.com/ai.test.com.cer \
    --reloadcmd     "nginx -t && service nginx reload"
```

### 更新 Nginx 配置

编辑 `/etc/nginx/cert/ai.test.com/ai.test.com.conf` 文件，添加 SSL 配置部分，类似于以下内容：

```nginx
server {
    listen 443 ssl;
    server_name ai.test.com;

    ssl_certificate /etc/nginx/cert/ai.test.com/ai.test.com.cer;
    ssl_certificate_key /etc/nginx/cert/ai.test.com/ai.test.com.key;

    # ...其他配置文件内容...
}
```

确保 SSL 证书路径与 `--install-cert` 命令中指定的路径一致。

### 检查 Nginx 配置并重启

在应用配置更改之前，检查 Nginx 配置是否正确：

```sh
nginx -t
```

如果上述命令显示配置测试成功，则可以安全地重新加载或重启 Nginx 以应用新的配置：

```sh
service nginx reload
```

以上就是使用 `acme.sh` 结合阿里云 DNS 解析服务生成 SSL 证书并配置 Nginx 的步骤。在完成这些步骤之后，`ai.test.com` 应该能够通过 HTTPS 安全地提供服务，且 `acme.sh` 会自动设置续订任务以保证证书在到期前被更新。
