---
title: 实现 Omit
permalink: /typescript/questions/omit.html
date: 2024年03月08日17:48:37
description: 不使用 `Omit` 实现 `TypeScript` 的 `Omit<T, K>` 泛型。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
---

不使用 `Omit` 实现 `TypeScript` 的 `Omit<T, K>` 泛型。

`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

例如：

```ts

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
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

    type MyOmit<T, K extends keyof T> = {
        [P in keyof T as P extends K ? never : P]: T[P];
    };

    // @ts-expect-error
    type error = MyOmit<Todo, "description" | "invalid">;

```
