---
title: 对原型、原型链的理解
permalink: /javascript/prototype.html
date: 2023-10-23 20:37:51
description: JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会继承这一改变。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

在 JavaScript 中是使用构造两数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性，它的属性值是一个对象，这个对象包含了可以由该构造西数的所有实例共享的属性和方法。
当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造两数的prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说不应该能够获取到这个值的，但是现在 浏览器中都实现了_proto_ 属性来访问这个属性，但是最好不要 使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，可以通过这个方法米获取对象的原型。 

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象义会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 0bject.prototype 所以这就是新建的对象为什么能够使用 toString() 等方法的原因。 

特点：JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会继承这一改变。
![原型链图解](https://pic.imgdb.cn/item/65366accc458853aefbfcd92.jpg)
那么原型链的终点是什么？如何打印出原型链的终点？

由于 Object 是构造函数，原型链终点 Ob ject.prototype._proto_，而 Object.prototype._proto_ === null // true，所以，原型链的终点是 null。原型链上的所有原型都是对象，所有的对象最终都是由 0bject 构造的，而 Object.prototype 的下一级是Object. prototype._proto_。

![在这里插入图片描述](https://pic.imgdb.cn/item/653668e4c458853aefb94875.jpg)
