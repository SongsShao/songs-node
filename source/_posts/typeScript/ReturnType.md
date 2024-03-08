---
title: 实现 ReturnType
permalink: /typescript/questions/returntype.html
date: 2024年03月08日17:48:37
description: 不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---
不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。

例如：

```ts
    const fn = (v: boolean) => {
        if (v)
            return 1
        else
            return 2
    }

    type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

### 解答

```ts
    type MyReturnType<T extends Function> = T extends (...args: any[]) => infer R
    ? R
    : never;

    const fn = (v: boolean) => (v ? 1 : 2);
    const fn1 = (v: boolean, w: any) => (v ? 1 : 2);

    type fnType = MyReturnType<typeof fn>;
    type fnType1 = MyReturnType<typeof fn1>;

    type ComplexObject = {
        a: [12, "foo"];
        bar: "hello";
        prev(): number;
    };
    
    type fnType2 = MyReturnType<() => ComplexObject>;


```
