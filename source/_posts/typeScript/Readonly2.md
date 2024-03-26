---
title: 对象部分属性只读 Readonly
permalink: /typescript/questions/Readonly2.html
date: 2024年03月12日18:10:39
description: 实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---

实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。

类型 `K` 指定 `T` 中要被设置为只读 (readonly) 的属性。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。

例如

```ts
    interface Todo {
    title: string
    description: string
    completed: boolean
    }

    const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
    }

    todo.title = "Hello" // Error: cannot reassign a readonly property
    todo.description = "barFoo" // Error: cannot reassign a readonly property
    todo.completed = true // OK
```

### 解析

先取出需要 `readonly` 参数，然后在把不需要声明的参数用排除法加上。 

```ts
    type MyReadonly2<T, D extends keyof T> = {
        readonly [P in D]: T[P];
    } & {
        [P in keyof T as P extends D ? never : P]: T[P];
    };
```
