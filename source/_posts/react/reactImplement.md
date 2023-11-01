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
    import hasOwnProperty from '../../shared/hasOwnProperty';

    // dom 类型
    import { REACT_ELEMENT_TYPE  } from '../../shared/ReactSymbols';

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

```js
const root = createRoot(document.getElementById('root'))
```

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

![根fiber和节点容器互相指向](https://pic.imgdb.cn/item/653b5beac458853aef1a1a12.jpg)

    current指的是当前根容器正在显示或者已经渲染好的fiber树

react采用了双缓存区的技术，可以把将要显示的图片绘制在缓存区中，需要展示的时候直接拿来替换掉。 alternate 轮替。

![](https://pic.imgdb.cn/item/653bc1f2c458853aefb79377.jpg)

#### 创建队列
打开ReactFiberRoot.js文件，在return root之前加一行代码，给根fiber加上一个更新队列，之后更新渲染任务都是放到这个队列里面。

1. ReactFiberRoot.js
```js
    + import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue";
    ...
    + initialUpdateQueue(uninitializedFiber);
    return root;
```

2. ReactFiberClassUpdateQueue.js
```js
    export function initialUpdateQueue(fiber) {
        // 创建一个更新队列
        // pending 是循环链表
        const queue = {
            shared: {
                pending: null,
            }
        }
        fiber.updateQueue = queue;
    }
```

如下图所示在fiber树中增加了updateQueue 队列

![updateQueue 队列](https://pic.imgdb.cn/item/653bc2bdc458853aefbd2de4.jpg)

### 构建轮替的根fiber

#### fiber是怎么运作的

    为什么要轮替在上一篇已经说过了，这一篇写一下fiber的单项循环链表。

假如我们有一个jsx 的dom结构
```js
    let element = (
        <div className="A1">
            <div className="B1">
                <div className="C1"></div>
                <div className="C2"></div>
            </div>
            <div className="B2"></div>
        </div>
    )

```

在以前没有用fiber渲染是这样的，这个渲染方式是递归渲染如果数据很多就可能会卡顿。
```js
    let vDom = {
        "type": "div",
        "key": "A1",
        "props": {
            "className": "A1",
            "children": [
                {
                    "type": "div",
                    "key": "B1",
                    "props": {
                        "className": "B1",
                        "children": [
                            {
                                "type": "div",
                                "key": "C1",
                                "props": { "className": "C1"},
                            },
                            {
                                "type": "div",
                                "key": "C2",
                                "props": {"className": "C2"},
                            }
                        ]
                    },
                },
                {
                    "type": "div",
                    "key": "B2",
                    "props": {"className": "B2"},
                }
            ]
        },
    }
    // 把vDom一气呵成渲染到页面
    function render(element, container) {
        // 把虚拟DOM创建成真实DOM
        let dom = document.createElement(element.type);
        // 遍历属性
        Object.keys(element.props).filter(key => key !== 'children').forEach(key => {
            dom[key] = element.props[key];
        });
        // 把子节点渲染到父节点上
        if(Array.isArray(element.props.children)){
            element.props.children.forEach(child=>render(child,dom));
        }
        // 把真实节点挂载到容器
        container.appendChild(dom);
    }
    render(element, document.getElementById('root'));
```

下面是fiber的渲染方式，可以中断、暂停、恢复渲染。深度优先
```js
    // 把虚拟DOM构建成Fiber树
    let A1 = { type: 'div', props: { className: 'A1' } };
    let B1 = { type: 'div', props: { className: 'B1' }, return: A1 };
    let B2 = { type: 'div', props: { className: 'B2' }, return: A1 };
    let C1 = { type: 'div', props: { className: 'C1' }, return: B1 };
    let C2 = { type: 'div', props: { className: 'C2' }, return: B1 };
    A1.child = B1;
    B1.sibling = B2;
    B1.child = C1;
    C1.sibling = C2;

    // 下一个工作单元
    let nextUnitOfWork = null;

    function hasRemainingTime() {
        // 模拟有时间
        return true;
    }

    // render 工作循序
    function workLoop() {
        // 有下一个节点并且有时间时
        // 每一个任务执行完都可以放弃，让浏览器执行更高优先级的任务
        while(nextUnitOfWork && hasRemainingTime()) {
            // 执行下一个任务并返回下一个任务
            nextUnitOfWork = performUnitOfWork(fiber);
        }
        console.log('render 阶段结束");
    }
    
    // 执行完后返回下一个节点
    function performUnitOfWork(fiber) {
        // 执行渲染
        let child = beginWork(fiber);
        if(child) {
            return child;
        }
        // 如果没有子节点说明当前节点已经完成了渲染工作
        while(fiber) {
            // 可以结束此fiber的渲染了 
            completeUnitOfWork(fiber);
            // 如果有弟弟就返回弟弟
            if(fiber.sibling) {
                return fiber.sibling;
            }
            // 否则就返回上一层
            fiber = fiber.return;
        }
    }

    function beginWork(fiber) {
        console.log('beginWork', fiber.props.className);
        // 执行完成后返回第一个子节点
        return fiber.child;
    }

    function completeUnitOfWork(fiber) {
        // 标记当前这个fiber街道已经完成
        console.log('completeUnitOfWork', fiber.props.className);
    }

```

上面的这些代码是预先熟悉一下，fiber 是怎么运行，下面正式进入构建的代码逻辑。

#### 队列的单向链表

1. 在main.js 中增加下面代码
```js
root.render(element)
```

2. ReactDOMRoot.js
```js
    import { updateContainer } from '../react-reconciler/src/ReactFiberReconciler';
    ...
    ReactDomRoot.prototype.render = function (children) {
    // 1. 获取容器
    const root = this._internalRoot;
    updateContainer(children, root);
    }
```

3. ReactFiberReconciler.js
```js
    import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue';
    ...
    /**
     * 更新容器, 把虚拟DOM变成真实DOM 插入到container容器中
     * @param {*} element 虚拟DOM
     * @param {*} container 容器   FiberRootNode
     */
    export function updateContainer(element, container) {
    // 获取根fiber
    const current = container.current;
    // 创建更新队列
    const update = createUpdate();
    update.payload = {element};
    // 3. 把此更新任务对象添加到current这个根Fiber的更新队列里

    let root = enqueueUpdate(current, update);
    console.log(root);
    }
```

4. ReactFiberClassUpdateQueue.js

![ReactFiberClassUpdateQueue.js](https://pic.imgdb.cn/item/653e40f6c458853aefe48306.jpg)
```js
    import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdate'
    ...
    // 更新状态
    export const UpdateState = 0;

    export function createUpdate() {
        const update = {tag: UpdateState};
        return update;
    }

    export function enqueueUpdate(fiber, update) {
        // 获取根fiber的更新队列 (上一篇最后加的)
        const updateQueue = fiber.updateQueue;
        // 获取等待执行的任务
        const pending = updateQueue.shared.pending;
        // 说明初始化的状态
        if(pending === null) {
            update.next = update;
        } else {
            update.next = pending.next;
            pending.next = update;
        }
    
        // 让等待更新指向当前update 开始更新
        updateQueue.shared.pending = update;

        // 从当前的fiber 到返回找到并返回根节点

        return markUpdateLaneFromFiberToRoot(fiber);

    }

```

#### 冒泡获取根节点容器 

ReactFiberConcurrentUpdate.js
```js
    import { HostRoot } from './ReactWorkTags';

    /**
     * 本来此文件要处理更新优先级问题，把不同的fiber优先级冒泡一路标记到根节点。
     * 目前现在值实现向上冒泡找到根节点
     * @param {*} sourceFiber
     */

    export function markUpdateLaneFromFiberToRoot(sourceFiber) {
        // 当前父fiber
        let parent = sourceFiber.return;
        // 当前fiber
        let node = sourceFiber;

        // 一直找到 父fiber 为null
        while(parent !== null) {
            node = parent;
            parent = parent.return;
        }
        // 返回当前root节点
        if(node.tag === HostRoot) {
            const root = node.stateNode;
            return root;
        }
        return null;
    }

```

#### 调度更新

到目前为止更新对象已经添加到了根fiber的更新队列上，现在需要开始进行调度更新。

1. ReactFiberReconciler.js
```js
    import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
    ...
    export function updateContainer(element, container) {
    ...
    + scheduleUpdateOnFiber(root);
    }

```

2. ReactFiberWorkLoop.js
```js
    import { scheduleCallback } from './scheduler';

    export function scheduleUpdateOnFiber(root) {
        ensureRootIsScheduled(root);
    }

    export function ensureRootIsScheduled(root) {
        // 告诉浏览器要执行performConcurrentWorkOnRoot 参数定死为root
        scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
    }

    function performConcurrentWorkOnRoot(root) {
        console.log(root, 'performConcurrentWorkOnRoot');
    }
```

3. src/scheduler/index.js
```js
    export * from './src/forks/Scheduler';
```

4. src/forks/Scheduler.js
```js
    // 此处后面会实现优先级队列
    export function scheduleCallback(callback) {
    requestIdleCallback(callback);
    }
```

5. 打印FiberRootNode

![输出的FiberRootNode](https://pic.imgdb.cn/item/653e496bc458853aef00deb1.jpg)

### 工作循环

![工作循环](https://pic.imgdb.cn/item/653e4d86c458853aef11c6ea.jpg)

我们已经创建好一个根节点容器和一个空的根fiber（黑色部分），在图中看到还有一个正在构建中的根fiber。
根节点的current指的是当前的根fiber，是会和构建中的根fiber轮替工作（双缓冲），现在需要构建一个新的根fiber并且把fiber树写在里面。
一个是表示当前页面已经渲染完成的fiber树，一个是正在构建中还没有生效、更没有更新到页面的fiber树

#### 建立新的hostRootFiber

1. ReactFiberWorkLoop.js
```js
    import { creatWorkInProgress } from "./ReactFiber";

    // 正在进行中的工作
    let workInProgress = null

    //...

    /**
     * (被告知浏览器确保执行的函数)
     * 根据当前的fiber节点构建fiber树, 创建真实的dom节点, 插入到容器
     * @param {*} root
     */
    function performConcurrentWorkOnRoot(root) {
    // 1. 初次渲染的时候以同步方式渲染根节点, 因为要尽快展示 (初始化)
    renderRootSync(root);
    }

    function prepareFreshStack(root) {
    // 5. 根据老fiber构建新fiber (初始化)
    workInProgress = creatWorkInProgress(root.current);
    }

    function renderRootSync(root) {
    // 2. 先构建了一个空的栈
    prepareFreshStack(root);
    }

```

2. ReactFiber.js
```js
    /**
     * 根据老fiber和新的属性构建新fiber
     * @param {*} current 老fiber
     * @param {*} pendingProps 新的属性
     */
    export function creatWorkInProgress(current, pendingProps) {
        // 3. 拿到老fiber的轮替 第一次没有 (初始化)
        let workInProgress = current.alternate;
        if(workInProgress === null) {
            workInProgress = createFiberNode(current.tag, pendingProps, current.key);
            workInProgress.type = current.type;
            workInProgress.stateNode = current.stateNode;

            workInProgress.stateNode = current;
            current.alternate =  workInProgress;
        } else {
            // 如果有，说明是更新，只能改属性就可以复用
            workInProgress.pendingProps = current.pendingProps;
            workInProgress.type = current.type;
            workInProgress.flags = current.flags;
            workInProgress.subtreeFlags = NoFlags;
        }
        // 复制属性
        workInProgress.child = current.child;
        workInProgress.memoizedProps = current.memoizedProps;
        workInProgress.memoizedState = current.memoizedState;
        workInProgress.updateQueue = current.updateQueue;
        workInProgress.sibling = current.sibling;
        workInProgress.index = current.index;
        return workInProgress;
    }
```

#### 执行工作单元

然后在新的根fiber里构建更新fiber树

1. ReactFiberWorkLoop.js
```js
    import { beginWork } from "./ReactFiberBeginWork";
    ...
    function renderRootSync(root) {
        // 2. 先构建一个空的栈
        prepareFreshStack(root);
        // 1. 现在的 workInProgress 是新的根fiber
        workLoopSync();
    }

    // 工作同步循环
    function workLoopSync() {
        while(workInProgress !== null) {
            // 2. 执行工作单元
            performUnitOfWork(workInProgress);
        }
    }

    function performUnitOfWork(unitOfWork) {
        const current = unitOfWork.alternate;

        const next = beginWork(current, unitOfWork);

        unitOfWork.memoizedProps = unitOfWork.pendingProps;
        if(next === null) {
            // 说明已经完成
            // 完成工作单元
            // completeUnitOfWork(); // 这个方法之后写 先模拟一下完成工作
            workInProgress = null;
        } else {
            // 如果有子节点就成为下一个工作单元
            workInProgress = next;
        }
    }
```

2. ReactFiberBeginWork.js
```js
    import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
    import { processUpdateQueue } from './ReactFiberClassUpdateQueue';

    /**
     * 5. 根据 `新的` 虚拟dom去构建  `新的` fiber链表
     * @param {*} current 老fiber
     * @param {*} workInProgress 新fiber
     * @returns 下一个工作单元
     */
    export function beginWork(current, workInProgress) {
        console.log("beginWork", workInProgress);
        // 判断类型不同处理方式返回子节点或者弟弟
        switch(workInProgress.tag) {
            case HostRoot:
                return updateHostRoot(current, workInProgress);
            case HostComponent:
                return updateHostComponent(current, workInProgress);
            
            case HostText:
                return null;
            default:
                return null;
        }
    }

    function updateHostRoot(current, workInProgress) {
        // 需要知道它的子虚拟dom, 知道它的儿子的虚拟dom信息
        // 之前在根fiber的更新队列加的虚拟dom, 可以在这获取
        processUpdateQueue(workInProgress);
        const nextState = workInProgress.memoizedState;
        // 获取虚拟节点
        const nextChildren = nextState.element;
        reconcileChildren(current, workInProgress, nextChildren);

        return workInProgress.child;
    }

    function updateHostComponents(current, workInProgress) {}
```

#### 获取更新队列的虚拟dom
写上一步引入的`processUpdateQueue`方法

1. ReactFiberClassUpdateQueue.js
```js
    import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdate'

    export function initialUpdateQueue(fiber) {
        // 创建一个更新队列
        // pending 是循环链表
        const queue = {
            shared: {
                pending: null,
            }
        }
        fiber.updateQueue = queue;
    }

    // 更新状态
    export const UpdateState = 0;

    export function createUpdate() {
        const update = {tag: UpdateState};
        return update;
    }

    export function enqueueUpdate(fiber, update) {
        // 获取根fiber的更新队列 (上一篇最后加的)
        const updateQueue = fiber.updateQueue;
        // 获取等待执行的任务
        const pending = updateQueue.shared.pending;
        // 说明初始化的状态
        if(pending === null) {
            update.next = update;
        } else {
            update.next = pending.next;
            pending.next = update;
        }
    
        // 让等待更新指向当前update 开始更新
        updateQueue.shared.pending = update;

        // 从当前的fiber 到返回找到并返回根节点

        return markUpdateLaneFromFiberToRoot(fiber);

    }

    /**
     * 根据老状态和更新队列的更新计算最新的状态
     * @param {*} workInProgress 要计算的fiber
     */
    export function processUpdateQueue(workInProgress) {
        // 拿到更新队列
        const queue = workInProgress.updateQueue;
        // 等待生效的队列
        const pendingQueue = queue.shared.pending;
        // 如果有更新, 或者更新队列里有内容
        if(pendingQueue !== null) {
            // 清除等待生效的更新 因为在这就要使用了可以清除了
            queue.shared.pending = null;
            // 获取最后一个等待生效的更新 
            const lastPendingUpdate = pendingQueue;
            // 第一个等待生效的更新
            const firstPendingUpdate = pendingQueue.next;
            // 把更新链表剪开, 变成单向链表
            lastPendingUpdate.next = null;
            // 获取老状态 (会不停更新和计算赋值新状态, 所以起名newState)
            let newState = workInProgress.memoizedState;
            let update = firstPendingUpdate;
            while(update) {
                // 根据老状态和更新计算新状态
                newState = getStateFromUpdate(update, newState);
                update = update.next;
            }

            // 把最终计算到的状态赋值给 memoizedState
            workInProgress.memoizedState = newState;
        }
    }

    /**
     * 根据老状态和更新, 计算新状态
     * @param {*} update 更新
     * @param {*} prevState 上一个状态
     * @returns 新状态
     */
    function getStateFromUpdate(update, prevState) {
        switch(update.tag) {
            case UpdateState:
                const { payload } = update;
                return assign({}, prevState, payload);
        }
    }
```

#### 根据子虚拟dom创建子fiber节点

上上步还有一个`reconcileChildren`没有定义

1. ReactFiberBeginWork.js
```js
    import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

    /**
     * 根据新的虚拟dom生成新的fiber链表
     * @param {*} current 老的父fiber
     * @param {*} workInProgress 新的父fiber
     * @param {*} nextChildren 新的子虚拟dom
     */
    function reconcileChildren(current, workInProgress, nextChildren) {
        // 如果此新fiber没有老fiber, 说明是新创建的
        if (current === null) {
            // 挂在子fiber
            workInProgress.child = mountChildFibers(workInProgress, null, next);
        } else {
            // 更新:  协调子fiber列表 需要做DOM-DIFF   (初始化时的根fiber是有老fiber的(一开始创建的))
            workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren
            );
        }
    }

```

2. ReactChildFiber.js
```js
    import { createFiberFromElement } from './ReactFiber';
    import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
    /**
     *
     * @param {*} shouldTrackSideEffect 是否跟踪副作用
     * @returns
     */
    function createChildReconciler(shouldTrackSideEffect) {

    function reconcileSingElement(returnFiber, currentFirstFiber, element) {
            // 因为我们实现的是初次挂载, 老节点currentFirstFiber是没有的, 
            // 所以可以直接根据虚拟dom创建fiber节点
            const created = createFiberFromElement(element);
            created.return = returnFiber;
            return created;
        }

        /**
     * 比较子fiber  (DOM-DIFF) 就是用老的fiber链表和新的虚拟dom进行比较
     * @param {*} returnFiber 新父fiber
     * @param {*} currentFirstFiber 当前的第一个子fiber(老fiber的第一个儿子)
     * @param {*} newChild 新的子虚拟dom
     */
        function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
            // 现在暂时只考虑新的节点只有一个的情况
            if(typeof newChild === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        return reconcileSingElement(
                            returnFiber,
                            currentFirstFiber,
                            newChild
                        );
                    default:
                        break;
                }
            }
        }
        return reconcileChildFibers;
    }

    // 有老父fiber 更新
    export const reconcileChildFibers = createChildReconciler(true);
    // 没有老的父fiber 更新
    export const mountChildFibers = createChildReconciler(false);
```

3. ReactFiber.js
```js
    ...
    export function createFiberFromElement(element) {
        const type = element.type;
        const key = element.key;
        const pendingProps = element.props;
        const fiber = createFiberFromTypeAndProps(
            type,
            key,
            pendingProps
        );
        return fiber;
    }

        export function createFiberFromTypeAndProps(type, key, pendingProps) {
        let fiberTag = IndeterminateComponent;
        const fiber = createFiberNode(fiberTag, pendingProps, key);
        fiber.type = type;
        return fiber;
    }
```

### 完成工作单元

1. ReactFiberWorkLoop.js
```js
    function completeUnitOfWork(unitOfWork) {
        ...
        if (next === null) {
        // 说明已经完成
        // 完成工作单元
        + completeUnitOfWork(unitOfWork); // 这个方法之后写 先模拟一下完成工作
            // workInProgress = null;
        } else {
            // 如果有子节点就成为下一个工作单元
            workInProgress = next;
        }
    }
    function completeUnitOfWork(unitOfWork) {
        let completeWork = unitOfWork;
        do {
            // 拿到他的父节点和当前节点RootFiber
            const current = completeWork.alternate;
            const returnFiber = completeWork.return;
            let next = completeWork(current, completeWork);
            // 如果下一个节点不为空
            if(next !== null) {
            workInProgress = next;
            return;
            }
            
            const siblingFiber = completeWork.sibling;
            // 如果兄弟节点不为空
            if(siblingFiber !== null) {
            workInProgress = siblingFiber;
            return;
            }
            // 返回父节点
            completeWork = returnFiber;

        } while(completeWork !== null);
    }
```