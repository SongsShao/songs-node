---
title: 浏览器原理
date: 2023-10-19 17:39:06
comments: false
---

学习流程

## v8引擎

[01.栈空间和堆空间](/browser/v8/StackAndHeap.html)
[02.垃圾回收](/browser/v8/GarbageCollection.html)
[03.编译器和解释器](/browser/v8/CompilerInterpreter.html)
[04. Scavenge 算法](/browser/v8/ScavengeAlgorithm.html)
[05. Mark-Sweep 算法](/browser/v8/MarkSweep.html)
[06. Mark-Compact 算法](/browser/v8/MarkCompact.html)
[07. Incremental Marking 算法](/browser/v8/IncrementalMarking.html)

## 浏览器中的页面循环系统

[01.消息队列和事件循环：页面是怎么“活”起来的？](/browser/pageEventLoop/MessageQueuesAndEventLoop.html)
[02. WebAPI：setTimeout是如何实现的？](/browser/pageEventLoop/setTimeout.html)
[03. WebAPI：requestAnimationFrame的工作机制](/browser/pageEventLoop/requestAnimationFrame.html)
[04. WebAPI：XMLHttpRequest是如何实现的？](/browser/pageEventLoop/XMLHttpRequest.html)
[05.宏任务和微任务：不是所有任务都是一个待遇](/browser/pageEventLoop/MacroAndMicroTasks.html)
[06. Promise：使用Promise，告别回调函数](/browser/pageEventLoop/PromiseXFetch.html)
[07. async/await：使用同步的方式去写异步代码](/browser/pageEventLoop/AsyncAwait.html)

## 浏览器中的页面

[01. DOM树：JavaScript 是如何影响DOM树构建的](/browser/pages/DOMTree.html)
[02.渲染流水线：CSS如何影响首次加载时的白屏时间？](/browser/pages/RenderPipeline.html)
[03.分层和合成机制：为什么CSS动画比JavaScript高效？](/browser/pages/LayeAndSynMecha.html)
[04.页面性能：如何系统地优化页面？](/browser/pages/Performance.html)
[05.虚拟DOM ：虚拟DOM和实际的DOM有何不同？](/browser/pages/VirtualDOM.html)
[06. WebComponent：像搭积木一样构建Web应用](/browser/pages/WebComponent.html)

## 浏览器中的网络

[01. HTTP/1：HTTP性能优化](/browser/http/1.html)
[02. HTTP/2：如何提升网络速度？](/browser/http/2.html)
[03. HTTP/3：甩掉TCP、TLS 的包袱，构建高效网络](/browser/http/3.html)

## 浏览器的安全

[01. 同源策略：为什么XMLHttpRequest不能跨域请求资源？](/browser/security/SameOriginPolicy.html)
[02. 跨站脚本攻击（XSS）：为什么Cookie中有HttpOnly属性？](/browser/security/CorssSiteScripting.html)
