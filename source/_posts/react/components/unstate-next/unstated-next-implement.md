---
title: unstate-next 的实现原理
permalink: /react/components/unstate-next-implement.html
date: 2023-10-26 15:49:35
description: unstate-next 的实现原理，根据 React.createContext 和 React.useContext 方法重新包装，简化使用步骤。
tag: [前端, react, TypeScript, unstate-next]
comments: true
categories: 
 - React
 - components
 - unstate-next
---

#### 定义实现Container接口

需要实现包装方法和获取数据的hooks

```tsx
    /**
     * 实现接口
     */
    export interface Container<Value, State> {
    Provider: React.ComponentType<ContainerProviderProps<State>>;
    useContainer: () => Value;
    }
```

#### 定义实现Provider接口

定义接口需要初始化参数和需要使用的子节点。

```tsx

    /**
     * ContainerProviderProps 定义类型
     * @param {State} State
     * @return {State} initialState
     * @return {React.ReactNode} children
     */
    export interface ContainerProviderProps<State = any> {
    initialState?: State;
    children: React.ReactNode;
    }

```

#### createContainer 方法

在 `createContainer` 方法中，使用后会返回两个方法 `Provider` 和 `useContainer`。

步骤：

1. 使用React.createContext 创建Context；
2. 自定义hooks 获取属性；
3. 需要使用Context 子组件使用Provider 包装， 将数据写入Context；
4. 使用React.useContext 从 Context 中获取属性

```tsx
    export function createContainer<Value, State = void>(
    useHook: (initialState?: State) => Value
    ): Container<Value, State> {
    // 使用React.createContext 创建Context
    const Context = React.createContext<Value | typeof EMPTY>(EMPTY);

    function Provider(props: ContainerProviderProps<State>) {
        // 自定义hooks 获取属性
        let value = useHook(props.initialState);
        // 需要使用Context 子组件使用Provider 包装， 将数据写入Context。
        return <Context.Provider value={value}>{props?.children}</Context.Provider>;
    }

    function useContainer(): Value {
        // 使用React.useContext 从 Context 中获取属性
        let value = React.useContext(Context);
        if (value === EMPTY) {
        throw new Error("Component must be wrapped with <Container.Provider>");
        }
        return value;
    }
    return {
        Provider,
        useContainer,
    };
    }
```

#### useContainer

使用useContainer 从 Container 中直接获取属性。

```tsx
    export function useContainer<Value, State = void>(
    container: Container<Value, State>
    ): Value {
    return container.useContainer();
    }
```

#### [unstate-next 使用](./unstate-next-use.html)
