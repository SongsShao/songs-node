---
title: 浏览器缓存的全过程
permalink: /browser/mechanism/cache.html
date: 2023-10-20 16:29:38
description: 浏览器第一次加载资源，服务器返回 200，浏览器从服务器下载资源文件，并缓存资源文件与 response header，以供下次加载时对比使用
tag: [前端, 浏览器]
comments: true
categories: 
 - 浏览器
 - 缓存
---

### 浏览器缓存的全过程

![浏览器缓存的全过程](https://pic.imgdb.cn/item/65323b8ec458853aef72a6ad.png)

浏览器缓存的全过程涉及了几种不同的缓存机制，主要包括浏览器缓存和 HTTP 协议中定义的缓存控制策略。下面是浏览器缓存的全过程的概览：

1. 用户方法网页

    浏览器根据用户请求的 URL 加载相应的网页；

2. 浏览器检查缓存

    浏览器首先检查它的本地缓存（强缓存），检查请求的资源是否已经缓存，并且缓存是否仍然有效（根据 Expires 和 Cache-Control 响应头）；
