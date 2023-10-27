---
title: React 实现原理
permalink: /react/implement.html
date: 2023-10-27 10:58:50
description: Fiber 架构的实现使得 React 能够在多任务之间动态地切换，并根据任务的优先级和时间片进行灵活的调度。
tag: [前端, react, JavaScript, JSX]
comments: true
categories: 
 - React
---

### 实现jsx

```jsx
    let element = (
    <h1>
        hello<span style={{ color: "red" }}>world</span>
    </h1>
    );
    console.log(element);

```

### 编译后

![jsx 编译之后](https://pic.imgdb.cn/item/653b2718c458853aef75775a.jpg)

### 如何实现

1. jsx-dev-runtime.js

```jsx
    export { jsxDEV } from "./jsx/ReactJSXElement";

```

2. ReactJSXElement.js

```jsx
    import hasOwnProperty from '../shared/hasOwnProperty';

    // dom 类型
    import { REACT_ELEMENT_TYPE  } from '../shared/ReactSymbols';

    const RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
    };

    function hasValidKey(config) {
        return config.key !== undefined;
    }

    function hasValidRef(config) {
        return config.ref !== undefined;
    }

    // ReactElement 创建
    function ReactElement(type, key, ref, props, owner) {
        return {
            // 这个标签允许我们唯一地将其标识为React元素
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            ref,
            props,
            
        }
    }


    export function jsxDEV(type, config) {
        // 提取保留名称
        const props = {};
        let key = null;
        let ref = null;
        if(hasValidKey(config)) {
            key = config.key;
        }

        if(hasValidRef(config)) {
            ref = config.ref;
        }

        for(const propName in config) {
            if(hasOwnProperty.call(config, propName) &&
            !RESERVED_PROPS.hasOwnProperty(propName)
            ) {
                props[propName] = config[propName];
            }
        }
        return ReactElement(type, key, ref, props)
    }

```

3. hasOwnProperty.js

```jsx
    const { hasOwnProperty } = Object.prototype;

    export default hasOwnProperty;
```

4. ReactSymbols.js

```jsx
    // 用于标记类似 ReactElement 类型的符号。
    export const REACT_ELEMENT_TYPE = Symbol.for('react.element');
```

### 根节点和根fiber

- 需要给react提供一个根节点，之后每个节点都是渲染在根节点内部的。

`const root = createRoot(document.getElementById('root'))`

- 根fiber可以通俗理解为一个装着所有虚拟dom的容器，每个虚拟dom又单独对应一个fiber，
- 渲染可以以单个fiber为单位暂停 / 恢复。
- 需要创建两个根 `fiber` 去相互替换展示。

#### 创建根节点

更改main.jsx

```jsx
    import { createRoot } from "react-dom/client"

    let element = (
    <h1>hello<span style={{ color: 'red' }}>world</span></h1>
    )

    const root = createRoot(document.getElementById('root'));
    console.log(root)

```

首先要建一个`FiberRootNode`根节点，也就是所有DOM的根，本质就是 `div#root`。

根节点和`fiber`关系：

![根节点和`fiber`关系](https://pic.imgdb.cn/item/653b2a66c458853aef7f6122.jpg)

`FiberRootNode` 和 `HostRootFiber` 中间使用 `current` 相连；

`HostRootFiber` 和 `FiberRootNode` 中间使用 `stateNode` 相连。

#### 实现createRoot

分这么多文件的主要是因为很多其他逻辑要处理，暂时都给省略了。虽然比较绕，但其实本质就是把`div#root`做了几层包装。

1. client.js

```js
    export { createRoot } from "./src/client/ReactDOMRoot";
```

2. ReactDOMRoot.js

```js
    import { createContainer } from "react-reconciler/src/ReactFiberReconciler";
    function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
    }
    // 创建一个根 实际就是一个被包装过的真实DOM节点
    // container: div#root
    export function createRoot(container) {
    // 1. 创建容器   6. 接收到有#root的容器
    const root = createContainer(container);
    // 7. 容器传给 ReactDOMRoot
    return new ReactDOMRoot(root);
    }
```

3. ReactFiberReconciler.js

```js
    import { createFiberRoot } from "./ReactFiberRoot";
    // 创建容器 containerInfo: 容器信息
    export function createContainer(containerInfo) {
    // 2
    return createFiberRoot(containerInfo);
    }
```

4. ReactFiberRoot.js

```js
    function FiberRootNode(containerInfo) {
    // 4. 把DOM节点放到容器
    this.containerInfo = containerInfo
    }
    export function createFiberRoot(containerInfo) {
    // 3. 创建根容器
    const root = new FiberRootNode(containerInfo);
    // 这个位置在下一步要创建 FiberRoot
    // 5. 把容器返回出去
    return root;
    }
```

现在根节点`FiberRootNode`创建好了，最后`root`的打印结果：

![FiberRootNode](https://pic.imgdb.cn/item/653b2e66c458853aef8a195c.jpg)

#### fiber

在创建根fiber之前先了解一下fiber

#### 为什么需要有fiber？

- react以前没有fiber整个计算过程不能暂停，会导致时间过长
- 浏览器刷新频率为 60Hz,大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6ms 的话，就会导致掉帧、卡顿，解决方案就是 React 利用空闲的时间进行更新，不影响渲染进行的渲染
- 把一个耗时任务切分成一个个小任务，分布在每一帧里。这个的方式就叫时间切片

我们需要把渲染变成一个可中断，可暂停，可恢复的过程。
注：可以去搜一下 requestIdleCallback API ，react封装了一个类似的方法让每帧时间固定 5ms。

#### 什么是fiber？

- Fiber 是一个执行单元

    Fiber 是一个执行单元,每次执行完一个执行单元，React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去。

    react 中一帧的过程：

    ![react 中一帧的过程](https://pic.imgdb.cn/item/653b551cc458853aef02aa5f.jpg)

- Fiber 是一种数据结构
    React 目前的做法是使用链表, 每个虚拟节点内部表示为一个Fiber
    从顶点开始遍历
    如果有第一个儿子，先遍历第一个儿子
    如果没有第一个儿子，标志着此节点遍历完成
    如果有弟弟遍历弟弟
    如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
    没有父节点遍历结束

    遍历结构：
    ![遍历结构](https://pic.imgdb.cn/item/653b55d2c458853aef05059f.jpg)

    遍历过程：
    ![遍历过程](https://pic.imgdb.cn/item/653b55f9c458853aef0589a3.jpg)

#### 创建根fiber

真实DOM需要一个根容器，`fiber`同样需要一个根`fiber`。

相当于每个虚拟DOM都会创建一个对应的`Fiber`，再创建真实DOM

虚拟DOM => Fiber => 真实DOM

在刚刚创建FiberRootNode的函数里去创建`HostRootFiber`并互相指向对方。

![根节点和`fiber`关系](https://pic.imgdb.cn/item/653b2a66c458853aef7f6122.jpg)

1. ReactFiberRoot.js

```js
    import { createHostRootFiber } from "./ReactFiber";

    function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo;
    }
    export function createFiberRoot(containerInfo) {
    // 之前创建的根节点容器
    const root = new FiberRootNode(containerInfo);
    // 1. 创建根fiber. hostRoot就是根节点dev#root
    // 未初始化的fiber
    const uninitializedFiber = createHostRootFiber();
    // 当前渲染页面的fiber.
    // 6. 根容器的current指向当前的根fiber
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;
    return root;
    }

```

2. ReactFiber.js

```js
    // 3. 工作标签
    import { HostRoot } from "./ReactWorkTags";
    // 5. 副作用标识
    import { NoFlags } from "./ReactFiberFlags";

    export function FiberNode(tag, pendingProps, key) {
    this.tag = tag;
    this.key = key;
    this.type = null; // fiber类型, 来自于虚拟DOM节点的type   (span h1 p)
    this.stateNode = null; // 此fiber对应的真实DOM节点

    this.return = null; // 指向父节点
    this.child = null; // 指向第一个子节点
    this.sibling = null; // 指向弟弟

    this.pendingProps = pendingProps; // 等待生效的属性
    this.memoizedProps = null; // 已经生效的属性
    // 虚拟DOM会提供pendingProps给创建fiber的属性，等处理完复制给memoizedProps

    // 每个fiber还会有自己的状态，每一种fiber状态存的类型都不一样
    // 比如：类组件对应的fiber存的就是实例的状态，HostRoot存的就是要渲染的元素
    this.memoizedState = null;

    // 每个fiber可能还有自己的更新队列
    this.updateQueue = null;

    // 5. "./ReactFiberFlags"
    this.flags = NoFlags; // 副作用标识，表示对此fiber节点进行何种操作
    this.subtreeFlags = NoFlags; // 子节点对应的副作用标识
    this.alternate = null; // 轮替 (缓存了另一个fiber节点实例) diff时用
    }

    export function createFiberNode(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
    }

    export function createHostRootFiber() {
    return createFiberNode(HostRoot, null, null);
    }

```

3. ReactWorkTags.js

```js
    // 每种虚拟DOM都会对应自己的fiber的类型
    // 根Fiber的Tag
    export const HostRoot = 3; // 根节点
    export const HostComponent = 5; // 原生节点 span div p
    export const HostText = 6; // 纯文本节点
    // ...

```

4. ReactFiberFlags.js

```js
    // 没有任何操作
    export const NoFlags = 0b000000000000000000000000000000;
    // 插入
    export const Placement = 0b000000000000000000000000000010;
    // 更新
    export const Update = 0b000000000000000000000000000100;

```
看最后root的打印结果：根fiber和节点容器互相指向

![](https://pic.imgdb.cn/item/653b5beac458853aef1a1a12.jpg)