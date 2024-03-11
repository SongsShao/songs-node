---
title: 实现 Pick
permalink: /typescript/questions/pick.html
date: 2024年03月08日17:48:37
description: 不使用 `Pick<T, K>` ，实现 TS 内置的 `Pick<T, K>` 的功能.
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---
不使用 `Pick<T, K>` ，实现 TS 内置的 `Pick<T, K>` 的功能

**从类型 `T` 中选出符合 `K` 的属性，构造一个新的类型**。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}

```

### 解答

```ts
    interface Todo {
    title: string;
    description: string;
    completed: boolean;
    }
    // 1. K extends keyof T, K继承所有的T的key属性为type
    // 2. P in keyof T 拿出所有的key，在extends K，如果是true，则返回 P
    type MyPick<T, K extends keyof T> = {
    [P in keyof T as P extends K ? P : never]: T[P];
    };

    type TodoPreviewMy = MyPick<Todo, "title" | "completed">;
    // type TodoPreviewMy = {
    //     title: string;
    //     completed: boolean;
    // }
    const todo: TodoPreviewMy = {
        title: "Clean room",
        completed: false,
    };

```
