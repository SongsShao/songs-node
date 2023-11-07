---
title: Hexo 开启公众号引流工具
permalink: /hexo/config/readmore.html
date: 2023-10-23 10:31:24
description: Hexo 开启公众号引流工具，可以通过阅读更多引流至微信公众平台。
tag: [前端, Hexo, ReadMore]
comments: true
categories: 
 - 前端
 - 框架
 - Hexo
---

###  配置博客信息

![](https://pic.imgdb.cn/item/6535dc4dc458853aef3ec866.jpg)

### hexo _config.yml 配置

```yml
plugins:
  readmore:
    blogId: 31652-1697970027416-119
    name: BaType
    qrcode: https://i.postimg.cc/BnGK06H2/qrcode-for-gh-50f2ce2229c5-258.jpg
    keyword: 666
```

其中,配置参数含义如下:

- blogId : [必选]OpenWrite 后台申请的博客唯一标识,例如:31652-1697970027416-119
- name : [必选]OpenWrite 后台申请的博客名称,例如:BaType
- qrcode : [必选]OpenWrite 后台申请的微信公众号二维码,例如:https://i.postimg.cc/BnGK06H2/qrcode-for-gh-50f2ce2229c5-258.jpg
- keyword : [必选]OpenWrite 后台申请的微信公众号后台回复关键字,例如:666

### 安装插件

`npm install hexo-plugin-readmore --save`

### 展示

![](https://pic.imgdb.cn/item/6535dddec458853aef428ef6.jpg)