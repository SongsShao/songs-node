---
title: FiberNode结构解析
permalink: /react/fiber/node.html
date: 2023-10-19 20:12:08
tag: [前端, react, JavaScript, Fiber]
comments: true
description: FiberNode（也称为 Fiber 节点）是 React Fiber 架构中的核心概念之一，用于表示组件的层级结构和渲染过程中的任务。
categories: 
 - react
---

# FiberNode结构解析

FiberNode（也称为 Fiber 节点）是 React Fiber 架构中的核心概念之一，用于表示组件的层级结构和渲染过程中的任务。
<!-- more -->


```javascript
function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;

  {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  {
    // This isn't directly used but is handy for debugging internals:
    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;

    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}
```

#### 

##### tag

表示 FiberNode 的类型，可以是 HostComponent、ClassComponent、FunctionComponent 等。

##### key

表示组件的唯一标识符，用于在列表渲染中进行元素的重用。

##### elementType

表示组件元素的类型。大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹。

##### type

type 属性表示 FiberNode 对应的组件类型，可以是字符串（原生组件）或函数/类（自定义组件）。对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName。

##### stateNode

每个 FiberNode 包含一个 stateNode 属性，它指向组件实例。stateNode 可以是一个 DOM 元素（对于原生组件），也可以是一个类实例（对于自定义组件）。



> ​	FiberNode 使用链表结构来表示组件的层级关系

##### return

return 指向父节点。

#####   child

  child 属性指向第一个子节点。

##### sibling

  sibling 属性指向下一个兄弟节点。

###### 例子：

```react
function App() {
  return (
    <div>
      i am
      <span>SongShao</span>
    </div>
  )
}

```

对应的`Fiber树`结构

```sh
		    App
		    ||
	  child || return
			||
    --------div ----------------
	        ||  			 ||
	  child || return  child || return 
            ||				 ||
           i am ----------- span
                  sibling    ||
              		   child || return
              		 	     ||
              		      SongShao
       
```

> 这里需要提一下，为什么父级指针叫做`return`而不是`parent`或者`father`呢？因为作为一个工作单元，`return`指节点执完`completeWork`（本章后面会介绍）后会返回的下一个节点。子`Fiber节点`及其兄弟节点完成工作后会返回其父级节点，所以用`return`指代父级节点。

##### index

在父节点中的索引位置。

##### ref

用于引用组件。

##### pendingProps

组件的待处理属性。

##### memoizedProps 和 memoizedState

这些属性保存了组件的当前状态（props 和 state）。在渲染过程中，React 使用 memoizedProps 和 memoizedState 保存组件的最新状态，并通过比较前后两次状态的差异，确定是否需要更新组件。

##### updateQueue

用于存储组件的更新队列。

##### dependencies

表示组件的依赖项。

##### mode

表示渲染模式。

##### flags 和 subtreeFlags

表示 FiberNode 的状态标志。

##### deletions

表示待删除的节点。

##### lanes 和 childLanes

表示调度的优先级。

##### alternate

alternate 属性指向 FiberNode 的替代节点。在渲染过程中，React 会创建两个 FiberNode，一个表示当前渲染状态，另一个表示下一次渲染状态。通过 alternate 属性，React 在两个状态之间进行比较，找出需要更新的节点。

##### actualDuration、actualStartTime、selfBaseDuration、treeBaseDuration

用于记录组件的实际渲染时间和基准时间。

##### __debugSource、__debugOwner、__debugNeedsRemount、__debugHookTypes

用于调试和内部记录。