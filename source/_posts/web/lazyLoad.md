---
title: 前端懒加载是什么?
permalink: /web/lazy/loading.html
date: 2023-10-21 21:05:16
description: 懒加载也叫做延迟加载、按需加载，指的是在长网页中延迟加载图片数据，是一种较好的网页性能优化的方式。
tag: [前端, 浏览器, 性能优化]
comments: true
categories: 
 - 浏览器
 - 性能优化
---


##### 懒加载的概念

懒加载也叫做延迟加载、按需加载，指的是在长网页中延迟加载图片数据，是一种较好的网页性能优化的方式。在比较长的网页或应用中，如果图片很多，所有的图片都被加载出来，而用户只能看到可视窗口的那一部分图片数据，这样就浪费了性能。
如果使用图片的懒加载就可以解决以上问题。在滚动屏幕之前，可视化区域之外的图片不会进行加载，在滚动屏幕时才加载。这样使得网页的加载速度更快，减少了服务器的负载。懒加载适用于图片较多，页面列表较长（长列表）的场景中。

##### 懒加载的特点

- 减少无用资源的加载：使用懒加载明显减少了服务器的压力和流量，同时也减小了浏览器的负担。
- 提升用户体验: 如果同时加载较多图片，可能需要等待的时间较长，这样影响了用户体验，而使用懒加载就能大大的提高用户体验。
- 防止加载过多图片而影响其他资源文件的加载：会影响网站应用的正常使用。

#####  懒加载的实现原理

图片的加载是由 src 引起的，当对 src 赋值时，浏览器就会请求图片资源。根据这个原理，我们使用 HTML5 的data-xxx 属性来储存图片的路径，在需要加载图片的时候，将 data-xxx 中图片的路径赋值给src，这样就实现了图片的按需加载，即懒加载。

**注意**：data-xxx 中的 xxx 可以自定义，这里我们使用data-src来定义。

懒加载的实现重点在于确定用户需要加载哪张图片，在浏览器中，可视区域内的资源就是用户需要的资源。所以当图片出现在可视区域时，获取图片的真实地址并赋值给图片即可。

使用原生 JavaScript 实现懒加载：

**知识点**：

window.innerHeight 是浏览器可视区的高度

document.body.scrollTop

document.documentElement.scrollTop 是浏览器滚动的过的距离

imgs.offsetTop 是元素顶部距离文档顶部的高度（包括滚动条的距离）

图片加载条件 ： img.offsetTop < window.innerHeight+document.body.scrollTop;

![在这里插入图片描述](https://pic.imgdb.cn/item/6533ccf1c458853aef92497a.png)

代码实现：

```html
<div class='container'>
    <img src='loading.gif' data-src='pic.png' />
    <img src='loading.gif' data-src='pic.png' />
    <img src='loading.gif' data-src='pic.png' />
    <img src='loading.gif' data-src='pic.png' />
    <img src='loading.gif' data-src='pic.png' />
    <img src='loading.gif' data-src='pic.png' />
</div>

<script>
    var imgs = document.querySelectorAll('img');
    function lazyLoad() {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var winHeight = window.innerHeight;
        for(let i = 0; i < imgs.lenght; i++) {
            if(imgs[i].offsetTop < scrollTop + winHeight) {
                imgs[i].src = imgs[i].getAttribute('data-src');
            }
        }
    }
    window.onsrcoll = lazyLoad();
</script>
```
