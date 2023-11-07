---
title: Hexo 开启 RSS
permalink: /hexo/config/rss.html
date: 2023-10-21 21:32:38
description: Hexo 开启RSS，可以查看RSS版本的note 数据，也可以导入到其他blog环境。
tag: [前端, Hexo, RSS]
comments: true
categories: 
 - 前端
 - 框架
 - Hexo
---

##### 安装hexo-generator-feed 插件

###### npm
`npm install hexo-generator-feed -d`
###### yarn
`yarn add hexo-generator-feed`

##### 配置_config.[themes].yml

###### 增加导航栏菜单
```yml
    RSS: /atom.xml || fa fa-rss
```

###### 参数配置

```yml
    feed:
        type: atom  # 类型为atom
        path: atom.xml # 访问路径
        limit: 20 # 分页

```
##### 清除重启

`hexo clean && hexo generate`

##### 页面效果

![atom.xml](https://pic.imgdb.cn/item/6533d473c458853aefb79c42.png)