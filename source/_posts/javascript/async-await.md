---
title: async/await 的理解
permalink: /javascript/async/await.html
date: 2023-10-20 21:20:45
description: 单一的 Promise 链并不能发现 async/await 的优势。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---


## async/await 的理解
async/await 其实是 Generator 的语法糖，它能实现的效果都能用then 链来实现，它是为优化 then 链而开发出来的。从字面上来看，async 是“异步”的简写，await 则为等待，所以很好理解async用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。当然语法上强制规定 await 只能出现在asnyc 函数中，先来看看 async 函数返回了什么：
```javascript
async function testAsy() {
	return "hello world;";
}
let result = testAsy();
console.log(result);
Promise {<fulfilled>: 'hello world;'}
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "hello world;"
```
所以，async 函数返回的是一个 Promise 对象。async 函数（包含函数语句、函数表达式、Lambda 表达式）会返回一个Promise对象，如果在函数中 return 一个直接量，async 会把这个直接量通过Promise.resolve() 封装成 Promise 对象。async 函数返回的是一个 Promise 对象，所以在最外层不能用await 获取其返回值的情况下，当然应该用原来的方式：then()链来处理这个 Promise 对象，就像这样：

```javascript
async function testAsy() {
	return "hello world;";
}
let result = testAsy();
console.log(result);
result.then(res => {
	console.log(res); // hello world;
})
```
那如果 async 函数没有返回值，又该如何？很容易想到，他会返回
```javascript
Promise.resolve(undefined);
```
联想一下 Promise 的特点——无等待，所以在没有await 的情况下执行 async 函数，它会立即执行，返回一个Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回Promise 对象的函数并无二致。

     注意：Promise.resolve(x) 可以看作是new Promise(resolve=>resolve(x)) 的简写
     可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

## async/await 的优势
单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then 链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它）。
假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。仍然用 setTimeout 来模拟异步操作：

```javascript
function takeLongTime(n) {
	return new Promise(resolve => {
		setTimeout(() => resolve(n + 200), n)
	})
};

function step1(n) {
	console.log(`step1 with ${n}`);
	return takeLongTime(n);
}
function step2(n) {
	console.log(`step2 with ${n}`);
	return takeLongTime(n);
}
function step3(n) {
	console.log(`step3 with ${n}`);
	return takeLongTime(n);
}
```
现在用 Promise 方式来实现这三个步骤的处理：
```javascript
function doIt(n) {
	console.time('doIt');
	const time1 = 300;
	step1(time1)
		.then(time2 => step2(time2))
		.then(time3 => step3(time3))
		.then(result => {
			console.log(`result is ${result}`);
			console.timeEnd('doIt');
		});	
}

doIt();
step1 with 300
step2 with 500
step3 with 700
result is 900
doIt: 1.652s

```

输出结果 result 是 step3() 的参数 700 + 200 = 900。doIt()顺序执行了三个步骤，一共用了 300 + 500 + 700 = 1500 毫秒，和console.time()/console.timeEnd() 计算的结果一致。如果用 async/await 来实现呢，会是这样：
```javascript
async function doIt() {
	console.time('doIt');
	const time1 = 300;
	const time2 = await step1(time1);
	const time3 = await step2(time2);
	const result = await step3(time3);
	console.log(`result is ${result}`);
	console.timeEnd('doIt');
}
doIt();
step1 with 300
step2 with 500
step3 with 700
result is 900
doIt: 1.515s
```

结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，几乎跟同步代码一样

## async/await 对比 Promise 的优势
代码读起来更加同步，Promise 虽然摆脱了回调地狱，但是then的链式调⽤也会带来额外的阅读负担

Promise 传递中间值⾮常麻烦，⽽async/await⼏乎是同步的写法，⾮常优雅

错误处理友好，async/await 可以⽤成熟的try/catch，Promise的错误捕获⾮常冗余

调试友好，Promise 的调试很差，由于没有代码块，你不能在⼀个返回表达式的箭头函数中设置断点，如果你在⼀个.then 代码块中使⽤调试器的步进(step-over)功能，调试器并不会进⼊后续的.then代码块，因为调试器只能跟踪同步代码的每⼀步。