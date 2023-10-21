---
title: 节流和防抖
permalink: /web/lodash/dubounce.html
date: 2023-10-21 21:00:16
description: 节流和防抖，有助于在输入或者点击某个按钮时进行优化事件响应。
tag: [前端, 浏览器, 性能优化]
comments: true
categories: 
 - 浏览器
 - 性能优化
---

#### 对节流与防抖的理解
函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件
又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因
为用户的多次点击向后端发送多次请求。
函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发
事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只
有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件
节流来降低事件调用的频率。

防抖函数的应用场景：
- 按钮提交场景：防止多次提交按钮，只执行最后一次提交
- 服务端验证场景： 表达验证需要服务端配合，只执行一段连续的输入事件的最后一次，还有索联想词功能类似生存环境可以使用lodash.debounce

节流函数的适用场景：

- 拖拽场景：固定实际内只执行一次，防止超高频次触发位置变动
- 缩放场景：监控浏览器resize
- 动画场景：避免短时间内多次触发动画引起性能问题

#### 实现节流函数和防抖函数

##### 函数防抖的实现
```javascript
function debounce(fn, wait) {
    let timer = null;
    return function() {
        console.log(123);
        let context = this, args = [...arguments];
        // 如果此时存在定时器则取消之前的定时器重新计时
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, wait);
    }
}
```

##### 函数节流的实现
```javascript
// 时间戳版
function throttle(fn, delay) {
    var preTime = Date.now();

    return function() {
        var context = this,
        args = [...arguments],
        nowTime = Date.now();

        // 如果两次时间间隔超过了指定时间，则执行函数。
        if(nowTime - preTime >= delay) {
            preTime = Date.now();
            return fn.apply(context, args);
        }
    };
}

// 定时器版
function throttle(fu, wait) {
    let timer = null;
    return function(){
        let context = this,
        args = [...arguments];
        if(!timer) {
            timer = setTimeout(() => {
                fu.apply(context, args);
                clearTimeout(timer);
            }, wait);
        }
    }
}
```
