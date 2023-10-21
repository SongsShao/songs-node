---
title: 有哪些可能引起前端安全的问题?
permalink: /web/security/question.html
date: 2023-10-21 21:09:16
description: ⼀种代码注⼊⽅式,为了与 CSS 区分所以被称作 XSS。早期常⻅于⽹络论坛, 起因是⽹站没有对⽤户的输⼊进⾏严格的限制, 使得攻击者可以将脚本上传到帖⼦让其他⼈浏览到有恶意脚本的⻚⾯, 其注⼊⽅式很简单包括但不限于 JavaScript / CSS / Flash 等。
tag: [前端, 浏览器, 网络安全]
comments: true
categories: 
 - 浏览器
 - 网络安全
---

##### [跨站脚本 (Cross-Site Scripting, XSS)](https://blog.csdn.net/qq_35490191/article/details/132212266)

⼀种代码注⼊⽅式,为了与 CSS 区分所以被称作 XSS。早期常⻅于⽹络论坛, 起因是⽹站没有对⽤户的输⼊进⾏严格的限制, 使得攻击者可以将脚本上传到帖⼦让其他⼈浏览到有恶意脚本的⻚⾯, 其注⼊⽅式很简单包括但不限于 JavaScript / CSS / Flash 等；

##### iframe 的滥⽤
iframe 中的内容是由第三⽅来提供的，默认情况下他们不受控制，他们可以在 iframe 中运⾏JavaScirpt 脚本、Flash插件、弹出对话框等等，这可能会破坏前端⽤户体验；

##### [跨站点请求伪造（Cross-Site Request Forgeries，CSRF）](https://blog.csdn.net/qq_35490191/article/details/132220538)

指攻击者通过设置好的陷阱，强制对已完成认证的⽤户进⾏⾮预期的个⼈信息或设定信息等某些状态更新，属于被动攻击恶意

##### 第三⽅库

⽆论是后端服务器应⽤还是前端应⽤开发，绝⼤多数时候都是在借助开发框架和各种类库进⾏快速开发，⼀旦第三⽅库被植⼊恶意代码很容易引起安全问题。