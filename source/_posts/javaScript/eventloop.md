---
title: 事件循环（Event Loop）
permalink: /javascript/eventloop.html
date: 2024年3月28日22:54:26
description: 事件循环（Event Loop）是计算机程序中的一个设计模式，用于处理异步操作，特别是在图形用户界面程序和服务器端应用程序中。事件循环模式通过等待并分派事件或回调函数来驱动程序的执行流程，而不是通过直接执行代码的方式。
tag: [前端, 浏览器, Event Loop]
comments: true
categories: 
 - 前端
 - javascript
---

事件循环（Event Loop）是计算机程序中的一个设计模式，用于处理异步操作，特别是在图形用户界面程序和服务器端应用程序中。事件循环模式通过等待并分派事件或回调函数来驱动程序的执行流程，而不是通过直接执行代码的方式。

在编程领域，事件循环通常余非阻塞I/O和异步编程模型结合使用。这种模式允许程序在等待一个长时间操作（如网络请求或磁盘I/O）完成时继续处理其他任务。一旦长时间操作完成，相关的回调函数就会被放入事件循环中等待执行。

事件循环的基本工作原理如下：

1. 事件循环开始时，它首先检查是否有任何事件或回调函数需要执行。
2. 如果没有事件或回调函数需要执行，事件循环将进入休眠状态，等待新事件或回调函数的到来。
3. 当有事件或回调函数需要执行时，事件循环从等待队列中取出事件或回调函数，并将其放入执行队列中。
4. 事件循环从执行队列中取出事件或回调函数，并执行它们。
5. 执行完成后，事件循环将事件或回调函数从执行队列中移除，并继续等待新的事件或回调函数。

在JavaScript中，事件循环通常由JavaScript引擎和宿主环境（如浏览器或Node.js）共同实现。JavaScript引擎负责执行代码，而宿主环境负责管理事件和回调函数。

如下代码：
```javascript
    console.log('1');
    setTimeout(() => {
        console.log('2');
        setTimeout(() => {
            console.log('3');
        }, 0);
    }, 0);
    console.log('4');

```

执行结果：
```shell
    1
    4
    2
    3
```

执行过程：

1. 现将 `console.log('1');` 放入执行队列中，并立即执行。
2. 将 `setTimeout(() => { console.log('2'); setTimeout(() => { console.log('3'); }, 0); }, 0);` 放入宏任务队列中。
3. 将 `console.log('4');` 放入执行队列中，并立即执行。
4. 将 `() => { console.log('2'); setTimeout(() => { console.log('3'); }, 0); }` 放入微任务队列中；
5. 当执行队列执行完以后去，微任务队列中查看是否有需要执行代码的回调函数，发现 `() => { console.log('2'); setTimeout(() => { console.log('3'); }, 0); }`；
6. 将 `console.log('2');` 放入执行队列中，并立即执行。
7. 将 `setTimeout(() => { console.log('3'); }, 0);` 放入宏任务队列中；
8. 将 `() => { console.log('3'); }` 放入微任务队列中；
9. 当执行队列执行完以后去，微任务队列中查看是否有需要执行代码的回调函数，发现 `() => { console.log('3'); }`；
10. 将 `console.log('3');` 放入执行队列中，并立即执行。

微任务（Microtask）和宏任务（Macrotask）是JavaScript中事件循环机制的两个重要概念，它们决定了异步代码的执行时机和顺序。以下是微任务和宏任务的主要区别以及它们各自包含的任务类型：

### 微任务（Microtask）

1. **定义**：
   微任务是一类非常小的任务，它们通常与当前执行栈中的代码有关，并且总是在当前执行栈清空后立即执行。

2. **特点**：
   - 微任务具有高优先级，它们总是在宏任务之前执行。
   - 微任务可以快速响应状态的变化，因为它们在每次事件循环迭代的末尾执行。
   - 微任务的执行不会阻塞后续代码的执行。

3. **包含的任务类型**：
   - `Promise`的`.then()`回调函数。
   - `MutationObserver`的回调函数。
   - 手动添加的微任务，例如使用`queueMicrotask()`函数。

### 宏任务（Macrotask）

1. **定义**：
   宏任务是一类较大的任务，它们通常与用户交互或I/O操作有关，并且总是在微任务执行完毕后执行。

2. **特点**：
   - 宏任务具有较低的优先级，它们总是在微任务之后执行。
   - 宏任务的执行可能会阻塞后续代码的执行，因为它们通常涉及到等待外部事件或资源。
   - 宏任务的执行次数通常比微任务多，因为每次事件循环迭代可能包含多个宏任务。

3. **包含的任务类型**：
   - `setTimeout`和`setInterval`的回调函数。
   - `requestAnimationFrame`的回调函数。
   - `setImmediate`（在Node.js中可用）的回调函数。
   - 浏览器事件，如点击、滚动、键盘输入等。
   - 网络请求、文件读写等I/O操作完成后的回调函数。

### 事件循环中的执行顺序

在JavaScript的事件循环中，微任务和宏任务按照以下顺序执行：

1. 执行当前执行栈中的所有同步代码。
2. 清空当前执行栈。
3. 执行所有微任务队列中的微任务。
4. 执行所有宏任务队列中的宏任务。
5. 重复步骤1-4，直到微任务和宏任务队列都为空。

这种机制确保了JavaScript能够以非阻塞的方式处理异步事件，同时保证了高优先级任务（如用户交互和状态变化）能够及时响应。开发者可以利用微任务和宏任务的特性来优化代码性能和用户体验。

下面实例代码包括微任务和宏任务：

```js
    // 1. 同步代码执行
    console.log('1');
    // 3. 宏任务执行
    const timeoutId = setTimeout(
        // 4. 微任务执行
        () => {
            console.log('2');
            clearTimeout(timeoutId);
        }, 0);
    // 3. 宏任务执行
    const intervalId = setInterval(
        // 4. 微任务执行
        () => {
            console.log('3');
            clearInterval(intervalId);
        }, 0);
    // 1. 同步代码执行
    const promise = new Promise((resolve) => {
        console.log('5');
        resolve('6');
    });
    // 2. 微任务执行
    promise().then((res) => {
        console.log(res);
    })
    // 1. 同步代码执行
    console.log('4');

```

**结果**：
```shell
    1
    5
    4
    6
    2
    3
```

大家猜一下下面**实例3**的结果：

```js
    console.log('1');
    const timeoutId = setTimeout(() => {
        console.log('2');
        clearTimeout(timeoutId);
        (() => {
            console.log('8');
        })();
    }, 0);

    setTimeout(() => {
        console.log('9');
    }, 1000);

    const promise = new Promise((resolve) => {
        console.log('5');
        (() => {
            console.log('10');
        })();
        resolve('6');
    });

    const intervalId = setInterval(() => {
        console.log('3');
        clearInterval(intervalId);
    }, 0);

    promise.then((res) => {
        console.log(res);
        (()=> {
            console.log('7');
        })();
    })
    console.log('4');
```