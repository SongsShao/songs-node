import React from "react";

const EMPTY: unique symbol = Symbol();

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

/**
 * 实现接口
 */
export interface Container<Value, State> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useContainer: () => Value;
}

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

export function useContainer<Value, State = void>(
  container: Container<Value, State>
): Value {
  return container.useContainer();
}
