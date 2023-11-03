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


```


```shell
server {
    listen       80;
    server_name  www.batype.com;
    #http转https(前提是已经配置nginx ssl证书)
    rewrite ^/(.*)$ https://www.batype.com/$1 permanent;
}

    # HTTPS
server {
    listen 443;
    server_name www.batype.com;                         #网站域名
    ssl on;
    ssl_certificate /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.pem;         #(证书公钥)
    ssl_certificate_key /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.key;             #(证书私钥)
    ssl_session_timeout 5m;
    #ssl_protocols SSLv2 SSLv3 TLSv1;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    #ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
        gzip_static on;
        root /home/html/songs-note;; #html访问路径
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    # location /admin {
    #     proxy_pass http://127.0.0.1:6060/admin;
    #     proxy_read_timeout 300s;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection $connection_upgrade;
    #     proxy_http_version 1.1;
    # }

}
```

```shell
server {
    listen       80;
    server_name  batype.mukang.net;
      location / {
        gzip_static on;
        root /home/html/songs-note; #html访问路径
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

    # HTTPS
server {
    listen 443;
    server_name https://batype.mukang.net; #www.batype.com;   #网站域名
    ssl on;
    ssl_certificate /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.pem;         #(证书公钥)
    ssl_certificate_key /etc/nginx/conf.d/cert/www.batype.com/www.batype.com.key;             #(证书私钥)
    ssl_session_timeout 5m;
    #ssl_protocols SSLv2 SSLv3 TLSv1;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    #ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
  
    # location /admin {
    #     proxy_pass http://127.0.0.1:6060/admin;
    #     proxy_read_timeout 300s;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection $connection_upgrade;
    #     proxy_http_version 1.1;
    # }

}
```