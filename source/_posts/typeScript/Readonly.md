---
title: 对象属性只读 Readonly
permalink: /typescript/questions/Readonly.html
date: 2024年03月11日10:11:24
description: 不要使用内置的`Readonly<T>`，自己实现一个。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---

不要使用内置的`Readonly<T>`，自己实现一个。

泛型 `Readonly<T>` 会接收一个 _泛型参数_，并返回一个完全一样的类型，只是所有属性都会是只读 (readonly) 的。

也就是不可以再对该对象的属性赋值。

例如：

```ts
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

### 解析

```ts
    type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
    };
```
