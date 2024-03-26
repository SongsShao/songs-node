---
title: 实现类似Vue的类型支持的简化版本
permalink: /typescript/questions/SimpleVue.html
date: 2024年03月11日11:29:39
description: 通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。
tag: [前端, TypeScript, type]
comments: true
categories: 
 - 前端
 - TypeScript
 - type
---

实现类似Vue的类型支持的简化版本。

通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的Object作为其唯一的参数，

- `data`是一个简单的函数，它返回一个提供上下文`this`的对象，但是你无法在`data`中获取其他的计算属性或方法。

- `computed`是将`this`作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

- `methods`是函数的对象，其上下文也为`this`。函数中可以访问`data`，`computed`以及其他`methods`中的暴露的字段。 `computed`与`methods`的不同之处在于`methods`在上下文中按原样暴露为函数。

`SimpleVue`的返回值类型可以是任意的。

```ts
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})

```

### 解答

```ts

    type DataType<T> = T extends { data(): infer D } ? D : never;

    type ComputedType<T, D> = T extends { computed: infer C }
    ? {
        [K in keyof C]: C[K] extends (this: D) => infer R ? R : never;
        }
    : {};

    type MethodsType<T, D, C> = T extends { methods: infer M }
    ? {
        [K in keyof M]: M[K] extends (this: D & C) => infer R ? R : never;
        }
    : {};

    declare function SimpleVue<T>(options: T): {
    data: DataType<T>;
    computed: ComputedType<T, DataType<T>>;
    methods: MethodsType<T, DataType<T>, ComputedType<T, DataType<T>>>;
    };

```
