---
title: Scp
permalink: /linux/install/scp.html
date: 2023-11-2 21:24:32
description: 单一的 Promise 链并不能发现 async/await 的优势。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

#### 复制文件夹到服务器
```shell
scp -r key root@47.108.140.70:/etc/nginx/conf.d/cert
```

ssh root@47.108.140.70

scp -r public/ root@47.108.140.70:/home/html/songs-note/

```shell
http {

    server {
        listen 443 ssl;
        server_name www.batype.com;
        ssl_certificate /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.pem;
        
        ssl_certificate_key /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.key;
        root         /home/html/songs-note;
        location / {
            index index.html index.htm;
            try_files $uri $uri/ =404;
        }
    }

}

```
