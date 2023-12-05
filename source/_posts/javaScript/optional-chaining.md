---
title: Optional chaining 语法编程
permalink: /javascript/optional/chaining.html
date: 2023年12月05日10:44:37
description: Optional chaining 是一个现代JavaScript语法特性，允许开发者在读取对象内部嵌套属性时安全地处理 undefined 或 null 值。这种语法通过 ?. 操作符实现，可以避免在查询属性或调用方法时因为中间某个环节不存在而引发错误。
tag: [前端, JavaScript, es6]
comments: true
categories: 
 - 前端
 - es6
---

### 什么是 Optional Chaining？

Optional chaining 是一个现代JavaScript语法特性，允许开发者在读取对象内部嵌套属性时安全地处理 `undefined` 或 `null` 值。这种语法通过 `?.` 操作符实现，可以避免在查询属性或调用方法时因为中间某个环节不存在而引发错误。

### Optional chaining 的基本使用示例如下

```js
    const obj = {
        a: {
            b: {
                c: 1
            }
        }
    };
    // 传统的深层属性访问可能会抛出错误，如果某个属性不存在
```

```js
    const value = obj && obj.a && obj.a.b && obj.a.b.c;
    // 使用 optional chaining 语法，安全地读取嵌套属性
```

```js
    const valueWithOptionalChaining = obj?.a?.b?.c; // 输出 1
    // 如果中间某个属性不存在，表达式会返回 undefined，而不是抛出错误
    const undefinedValue = obj?.a?.nonExistingProp?.c; // 输出 undefined
```

### Optional chaining 可以用于四种不同的操作

1. 对象属性访问

如上例所示，可以安全地访问嵌套对象属性。

2. 数组索引访问

可以安全地访问数组的索引，如果数组是 undefined 或 null，则不会报错。

```js
    const arr = [1, 2, 3];
    const valueAtIndex = arr?.[2]; // 输出 3
    const nonExistingIndex = arr?.[5]; // 输出 undefined
```

3. 函数或方法调用

如果不确定一个对象上的函数是否存在，可以使用 optional chaining 安全地调用函数或方法。

```js
    const obj = {
    a: () => {
        console.log('Function exists');
    }
    };

    obj.a?.(); // 输出 'Function exists'
    obj.b?.(); // 由于 b 不存在，不执行任何操作，返回 undefined
```

4. 默认值中使用

```js
    const user = {};
    const name = user?.name ?? "匿名用户";
    console.log(name);
```

要注意的是，optional chaining 语法是 ECMAScript 2020（ES11）的一部分，因此在老旧的JavaScript环境中可能不受支持。对于这些环境，可以使用Babel这样的工具来转译代码，使其兼容。
