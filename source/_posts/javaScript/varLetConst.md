---
title: var、let、const的区别
permalink: /javascript/var/let/const.html
date: 2023-10-23 20:34:19
description: var、let、const三大基础类型使用非常广泛，所以需要切实熟练使用他们，更需要了解他们的所有属性。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

##### var 关键词
1. var声明作用域
var定义的变量，没有块的概念，可以跨块访问, 不能跨函数访问

```javascript
function test() {
    var message = "hello world";   // 局部变量
}
test();
console.log(message);  // 报错
```

函数test()调用时会创建变量message并给它赋值，调用之后变量随即被销毁。因此，在函数test()之外调用变量message会报错

在函数内定义变量时省略var操作符，可以创建一个全局变量

```javascript
function test() {
    message = "hello world";   // 局部变量
}
test();
console.log(message);  // hello world
```

省略掉var操作符之后，message就变成了全局变量。只要调用一次函数test()，就会定义这个变量，并且可以在函数外部访问到。在局部作用域中定义的全局变量很难维护，不推荐这么做。在严格模式下，如果像这样给未声明的变量赋值，则会导致抛出ReferenceError。

2. var声明提升
var在js中是支持预解析的，如下代码不会报错。这是因为使用var声明的变量会自动提升到函数作用域顶部：

```javascript
function foo() {
    console.log(age);
    var age = 26;
}
foo(); // undefined
```

javaScript引擎，在代码预编译时，javaScript引擎会自动将所有代码里面的var关键字声明的语句都会提升到当前作用域的顶端,如下代码：

```javascript
function foo() {
    var age;
    console.log(age);
    age = 26;
}
foo(); // undefined
```

##### let声明
1. let声明作用域
let定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问，而var可以跨块访问

```javascript
// var定义的变量
if (true) {
    var name = 'Matt';
    console.log(name); // Matt
}
console.log(name); // Matt

// let定义的变量
if (true) {
    let age = 26;
    console.log(age); // 26
}
console.log(age); // ReferenceError: age没有定义
```

let也不允许同一个块作用域中出现冗余声明（重复声明）

```javascript
var name;
var name;

let age;
let age; // SyntaxError；标识符age已经声明过了
```

2. 暂时性死区
let、const与var的另一个重要的区别，let、const声明的变量不会在作用域中被提升。ES6新增的let、const关键字声明的变量会产生块级作用域，如果变量在当前作用域中被创建出来，由于此时还未完成语法绑定，所以是不能被访问的，如果访问就会抛出错误ReferenceError。因此，在这运行流程进入作用域创建变量，到变量可以被访问之间的这一段时间，就称之为暂时死区。

```javascript
// name会被提升
console.log(name); // undefined
var name = 'Matt';

// age不会被提升
console.log(age); // ReferenceError：age没有定义
let age = 26;
```

3. 全局声明
与var关键字不同，var定义的全局变量会挂载到window对象上，使用window可以访问，而let在全局作用域中声明的变量不会成为window对象的属性

```javascript
var name = 'Matt';
console.log(window.name); // 'Matt'

let age = 26;
console.log(window.age); // undefined
```

4. for循环中的var、let声明
for循环中var定义的迭代变量会渗透到循环体外部：

```javascript
for (var i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i); // 5
```

改成使用let之后，这个问题就消失了，因为迭代变量的作用域仅限于for循环块内部：

```javascript
for (let i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i); // ReferenceError: i没有定义
```

使用var和let定义for循环中的变量，循环里使用定时器setTimeout后循环结果如下代码：

```javascript
for (var i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0)
}
// 输出5、5、5、5、5

for (let i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0)
}
// 输出0、1、2、3、4
```

let 是在代码块内有效，var 是在全局范围内有效。let 只能声明一次 ，var 可以声明多次。

当同步代码执行完毕后，开始执行异步的setTimeout代码，执行setTimeout时需要从当前作用域内寻找一个变量 i，for循环执行完毕，当前 i=5，执行setTimeout时输出为5，任务队列中的剩余4个setTimeout也依次执行，输出为5。

变量 j 是用 let 声明的，当前的 i 只在本轮循环中有效，每次循环的 j 其实都是一个新的变量，所以 setTimeout 定时器里面的 j 其实是不同的变量，即最后输出0-4。

##### const声明
const的行为与let基本相同，唯一一个重要的区别是：

const是用来定义常量的，而且定义的时候必须赋值，不赋值会报错，定义之后是不允许被修改的，修改const声明的变量会导致运行时错误。

```javascript
const age = 26;
age = 36; // TypeError: 给常量赋值

// const也不允许重复声明
const name = 'Matt';
const name = 'Nicholas'; // SyntaxError

// const声明的作用域也是块
const name = 'Matt';
if (true) {
    const name = 'Nicholas';
}
console.log(name); // Matt
```

而const声明的变量是一个对象时，修改这个对象内部的属性并不会报错。

这是因为const声明的是栈区里的内容不能修改，基本数据类型的值直接在栈内存中存储，而引用数据类型在栈区保存的是对象在堆区的地址，修改对象的属性，不会修改对象在栈区的地址，如果重新给对象person赋值，则会报错。

```javascript
const person = {
    name: 'Lili'
};
person.name = 'Matt'; // ok
```

JavaScript引擎会为for循环中的let声明分别创建独立的变量实例，虽然const变量跟let变量很相似，但是不能用const来声明迭代变量（因为迭代变量会自增）：

```javascript
for (const i = 0; i < 10; ++i) {} // TypeError：给常量赋值
```

不过，如果你只想用const声明一个不会被修改的for循环变量，那也是可以的。也就是说，每次迭代只是创建一个新变量。这对for-of和for-in循环特别有意义：


```javascript
let i = 0;
for (const j = 7; i < 5; ++i) {
    console.log(j);
}
// 7, 7, 7, 7, 7
for (const key in {a: 1, b: 2}) {
    console.log(key);
}
// a, b
for (const value of [1,2,3,4,5]) {
    console.log(value);
}
// 1, 2, 3, 4, 5
```
