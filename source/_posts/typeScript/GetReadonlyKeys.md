---
title: 获取只读属性 GetReadonlyKeys
permalink: /typescript/questions/GetReadonlyKeys.html
date: 2024年03月11日10:11:24
description: 实现泛型`GetReadonlyKeys<T>`，`GetReadonlyKeys<T>`返回由对象 `T` 所有只读属性的键组成的联合类型。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---

实现泛型`GetReadonlyKeys<T>`，`GetReadonlyKeys<T>`返回由对象 T 所有只读属性的键组成的联合类型。

例如

```ts
interface Todo {
  readonly title: string
  readonly description: string
  completed: boolean
}

type Keys = GetReadonlyKeys<Todo> // expected to be "title" | "description"
```

### 解答

1. 映射类型：

- 使用了映射类型语法 `[P in keyof T]`，遍历 `T` 类型的所有键（包括公共和私有属性以及方法）。

2. 条件类型与函数类型比较：

- 对于每个键 `P`，创建一个返回值为布尔类型的匿名函数类型 `<I>() => ...`。
- 第一个函数类型检查是否有一个对象类型，其具有属性 `I` 等于 `T[P]` 的类型，这实际上是为了确保当前键 `P` 的存在性。
- 第二个函数类型则检查是否有只读版本的对象类型，其中属性 I 是只读的且类型为 `T[P]`。

3. 条件判断：

- 判断第一个函数类型是否能赋值给第二个函数类型，即判断 `T[P]` 是否是一个只读属性。
- 如果是，则结果为 `P`，表示该键 `P` 是只读属性。
- 否则，结果为 `never`，表示该键不是只读属性。

4. 取可读属性键集合：

- 最终通过 `keyof` 运算符从映射类型中提取所有满足上述条件（即为只读属性）的键 `P` 构成的联合类型。

5. 默认值`never`：

- 如果没有符合条件的只读属性，则整个映射类型的结果是空对象类型，因此 `keyof {}` 将得到 `never` 类型。

综上所述，`GetReadonlyKeys<T>` 类型会返回 T 中所有声明为只读属性的键名组成的联合类型。如果 `T` 没有只读属性，则返回类型为 `never`。

```ts
    type GetReadonlyKeys<T> = keyof {
        [
            P in keyof T as (
                <I>() => I extends ({ [I in P]: T[I] }) ? true : never
            ) extends (
                <I>() => I extends ({ readonly [I in P]: T[I] }) ? true : never
            ) ? P : never
        ] : never
    }

```
