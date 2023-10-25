---
title: Fiber架构工作原理
permalink: /react/fiber/works.html
date: 2023-10-25 18:12:49
tag: [前端, react, JavaScript, Fiber]
comments: true
description: 在`React`中最多会同时存在两棵`Fiber树`。当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树`。
categories: 
 - React
 - Fiber
---

## 什么是“双缓存”？

"双缓存"是一种常见的图形处理技术，用于在图像渲染中实现平滑的、无闪烁的更新效果。它通过使用两个缓冲区（即两块内存区域）来完成。其中一个缓冲区用于显示图像，而另一个缓冲区则用于在后台进行图像的更新和绘制。当更新完成后，通过交换两个缓冲区的引用，以实现无缝的切换和更新。

在图形处理中使用双缓存的好处包括：

1. 无闪烁：通过在后台缓冲区进行绘制，然后将绘制结果一次性地切换到显示缓冲区，可以避免在图像更新过程中的闪烁问题。这对于实时图形、动画和视频等应用非常重要。
2. 平滑更新：使用双缓冲可以实现平滑的更新效果。在后台缓冲区进行绘制和更新，然后在更新完成后将其切换到显示缓冲区，可以避免直接在显示缓冲区上进行绘制和修改，从而减少了可能出现的可见的渲染中间状态。
3. 减少渲染延迟：使用双缓冲可以减少渲染延迟。由于绘制和更新发生在后台缓冲区，因此可以在绘制完成后立即切换到显示缓冲区，从而减少了等待绘制完成的时间，提高了渲染效率和响应时间。

双缓存技术在图形处理、动画、视频播放和游戏开发等领域得到广泛应用。在图形库、操作系统和桌面应用程序中，双缓存被用于实现平滑的图像渲染和交互效果。在前端开发中，双缓存也被广泛应用于图形绘制和动画效果的实现，以提供更好的用户体验。

`React`使用“双缓存”来完成`Fiber树`的构建与替换——对应着`DOM树`的创建与更新。

## 双缓存Fiber树

在`React`中最多会同时存在两棵`Fiber树`。当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树`。

`current Fiber树`中的`Fiber节点`被称为`current fiber`，`workInProgress Fiber树`中的`Fiber节点`被称为`workInProgress fiber`，他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React `应用的根节点通过使 `current ` 指针在不同 `Fiber树` 的 `rootFiber` 间切换来完成 `current Fiber` 树指向的切换。

即当 `workInProgress Fiber树` 构建完成交给 `Renderer` 渲染在页面上后，应用根节点的 `current` 指针指向 `workInProgress Fiber树` ，此时`workInProgress Fiber树`就变为`current Fiber树`。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。

接下来我们以具体例子讲解`mount时`、`update时`的构建/替换流程。

## mount时

考虑如下例子：

```js
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

1. 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫`fiberRoot`）和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点。

之所以要区分`fiberRootNode`与`rootFiber`，是因为在应用中我们可以多次调用`ReactDOM.render`渲染不同的组件树，他们会拥有不同的`rootFiber`。但是整个应用的根节点只有一个，那就是`fiberRootNode`。

`fiberRootNode`的`current`会指向当前页面上已渲染内容对应`Fiber树`，即`current Fiber树`。

![rootFiber](https://react.iamkasong.com/img/rootfiber.png)

`fiberRootNode.current = rootFiber;`

由于是首屏渲染，页面中还没有挂载任何`DOM`，所以`fiberRootNode.current`指向的`rootFiber`没有任何`子Fiber节点`（即`current Fiber树`为空）。

2. 接下来进入`render阶段`，根据组件返回的`JSX`在内存中依次创建`Fiber节点`并连接在一起构建`Fiber树`，被称为`workInProgress Fiber树`。（下图中右侧为内存中构建的树，左侧为页面显示的树）

在构建`workInProgress Fiber树`时会尝试复用`current Fiber树`中已有的`Fiber节点`内的属性，在`首屏渲染`时只有`rootFiber`存在对应的`current fiber`（即`rootFiber.alternate`）。

![](https://react.iamkasong.com/img/workInProgressFiber.png)

3. 图中右侧已构建完的`workInProgress Fiber树`在`commit阶段`渲染到页面。

此时`DOM`更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。

![](https://react.iamkasong.com/img/wipTreeFinish.png)

## update时

1. 接下来我们点击`p节点`触发状态改变，这会开启一次新的`render阶段`并构建一棵新的`workInProgress Fiber 树`。

   ![](https://react.iamkasong.com/img/wipTreeUpdate.png)

和`mount`时一样，`workInProgress fiber`的创建可以复用`current Fiber树`对应的节点数据。

2. `workInProgress Fiber 树`在`render阶段`完成构建后进入`commit阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`。

![](https://react.iamkasong.com/img/currentTreeUpdate.png)

