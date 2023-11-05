---
title: unstate-next 的使用
permalink: /react/components/unstate-next-use.html
date: 2023-10-25 16:42:53
description: unstated-next 的使用可以简化react state manager，可以替换React 原有的useContext 方法, 亦可以管理全局状态信息。
tag: [前端, react, TypeScript, unstate-next]
comments: true
categories: 
 - React
 - components
 - unstate-next
---

#### Install

[Code-Test](https://gitcode.net/qq_35490191/React-TypeScript)

```shell
npm install --save unstated-next

yarn add unstated-next
```

#### createContainer

```ts
    import { useState } from "react";
    import { createContainer } from "unstated-next"

    const useCounter = (props: any) => {
        const { initNum } = props;
        const [num, changeNum] = useState<number>(initNum);
        let decrement = () => changeNum(num - 1)
        let increment = () => changeNum(num + 1)
        return {num, decrement, increment};
    }

    export const Counter = createContainer(useCounter);

```

#### use Provider && initialState

```ts
    import './App.css'
    import { Counter } from './Context'
    import {TestCounter} from './TestCounter'

    export default function App() {
    return (
        <Counter.Provider initialState={{ initNum: 1 }}>
        <TestCounter />
        </Counter.Provider>
    )
    }
```

#### useContainer

##### TestCounter

```ts
    import { Counter } from "./Context"
    import {TestChild} from './TestChild'

    export const TestCounter = () => {
        const { num, decrement } = Counter.useContainer();
        
        return <>
            <button onClick={decrement}>减法</button>
            <TestChild />
        </>
    }
```

##### TestChild

```ts
    import { Counter } from "./Context"

    export const TestChild = () => {
        const { num, increment } = Counter.useContainer();
        return <>
            {num} <button onClick={increment}>加法</button>
        </>
    }

```
