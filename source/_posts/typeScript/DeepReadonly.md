---
title: 对象属性只读（递归）DeepReadonly
permalink: /typescript/questions/DeepReadonly.html
date: 2024年03月12日18:10:39
description: 实现一个泛型 `DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---

实现一个泛型 `DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。不考虑数组、函数、类等。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

例如

```ts
    type X = { 
        x: { 
            a: 1
            b: 'hi'
        }
        y: 'hey'
    }

    type Expected = { 
        readonly x: { 
            readonly a: 1
            readonly b: 'hi'
        }
        readonly y: 'hey' 
    }

    type Todo = DeepReadonly<X> // should be same as `Expected`
```

### 解析

1. 属于基础类型则直接返回
2. 数组、Map、Set需要拆分其内容属性

```ts
    type Primitive = undefined | string | null | boolean | number | Function;

    
    type DeepReadonly<T> = T extends Primitive
        ? T
        : T extends Array<infer U>
        ? ReadonlyArray<DeepReadonly<T>>
        : T extends Map<infer K, infer V>
        ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
        ? ReadonlySet<DeepReadonly<U>>
        : { readonly [K in keyof T]: DeepReadonly<T[K]> };
```
