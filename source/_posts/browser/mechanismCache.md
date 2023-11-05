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

浏览器第一次加载资源，服务器返回 200，浏览器从服务器下载资源文件，并缓存资源文件与 response header，以供下次加载时对比使用；

下一次加载资源时，由于强制缓存优先级较高，先比较当前时间与上次返回 200 的时间差，如果没有超过 cache-control 设置的 max-age，则没有过期，并命中强缓存，直接从本地读取数据资源。如果浏览器不支持HTTP1.1，则使用 expires 头判断是否过期；

如果资源已过期，则标明强制缓存没有被命中，则开始协商缓存，向服务器发送带有 If-None-Match 和 If-Modified-Since 的请求；

服务器收到请求后，优先根据 Etag 的值判断被请求的文件有没有做修改，Etag 值一致则没有修改，命中协商缓存，返回 304；如果不一致则有改动，直接返回新的资源文件带上新的 Etag 值并返回 200；

如果服务器收到的请求没有 Etag 值，则将 If-Modified-Since 和被请求文件的最后修改时间作对比，一致则命中协商缓存，返回 304；

不一致则返回新的 last-modified 和文件并返回200；
