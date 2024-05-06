---
title: WebAPI：requestAnimationFrame的工作机制
date: 2024年05月06日14:12:28
---

`requestAnimationFrame` 是一个由浏览器提供的API，用于请求在下一次重绘之前调用指定的回调函数，以执行动画或任何一类的框架更新。这个API主要用于创建平滑的动画效果，因为它允许浏览器优化动画的运行，减少重绘和重排的次数，并在合适的时机为动画帧执行回调，从而达到更流畅的视觉效果。

## 工作机制

`requestAnimationFrame` 的工作机制可以总结如下：

1. **帧率控制**：
   `requestAnimationFrame` 通常以浏览器的刷新率运行，大多数现代显示器有60Hz的刷新率，因此它尝试以大约60次每秒（60 FPS）的速度运行回调函数。

2. **可视性优化**：
   当运行在一个非激活的标签页或不可见的`iframe`中时，`requestAnimationFrame` 会暂停调用回调函数，从而节省CPU和电池。

3. **合成器线程（Compositor Thread）**：
   现代浏览器使用多线程来把页面绘制工作分摊给合成器线程。这意味着对于某些改变不涉及布局的样式（如`transform`和`opacity`），`requestAnimationFrame` 可以在不阻塞主线程的情况下更新动画。

4. **协同帧延**：
   `requestAnimationFrame` 确保在浏览器重绘之前执行回调，这样可以减少由于JavaScript运行时间过长而错过帧的情况，所以说它是与浏览器重绘过程协同工作的。

## 用法

使用 `requestAnimationFrame` 时，需要给它传递一个回调函数，浏览器将在下一次重绘前调用该函数。回调函数会接收一个时间戳参数，该时间戳表示请求重绘的时间点。

## 代码示例

下面的代码示例展示了如何使用 `requestAnimationFrame` 创建一个简单的动画效果。

```javascript
function animate() {
  // 更新动画状态
  // ...

  // 计算下一帧的动画状态
  // ...

  // 继续请求下一帧
  requestAnimationFrame(animate);
}

// 启动动画循环
requestAnimationFrame(animate);
```

## 取消请求

如果需要取消动画，可能是因为动画已经完成或用户界面发生变化，可以使用 `cancelAnimationFrame` 来取消之前的请求。

```javascript
var requestId = requestAnimationFrame(animate);

// 取消
cancelAnimationFrame(requestId);
```

## 执行顺序

`requestAnimationFrame` 回调的执行顺序是在浏览器重绘之前，这就意味着浏览器可以批量处理绘制操作，这通常优于使用 `setTimeout` 或 `setInterval`，后者不能保证回调函数的执行会紧贴浏览器的重绘周期。

## 与setTimeout的区别

`requestAnimationFrame` (rAF) 和 `setTimeout` 是用于在JavaScript中调度任务的两种不同的方法，它们在使用目的和工作机制上有明显的差异。以下是这两种方法的主要区别：

### 目的

- **requestAnimationFrame**：专为动画和帧更新设计，保证回调函数在浏览器重绘之前执行。这意味着动画在可视效果上更加平滑，因为它们与浏览器的帧率同步。
- **setTimeout**：用于在指定的延迟后执行一次回调函数。它不特别为动画设计，而是一种通用的方法来延迟任务的执行。

### 帧控制

- **requestAnimationFrame**：尝试以浏览器的帧率运行，通常是60帧每秒（60FPS），但会自动调整以匹配显示器的刷新率或运行环境的性能。
- **setTimeout**：简单地在指定的延迟后执行，不与浏览器的绘制过程同步，可能会导致动画出现跳帧或不平滑的现象。

### 性能和效率

- **requestAnimationFrame**：更高效，因为它能确保回调函数在正确的时间被调用，避免不必要的处理和重绘，从而减少资源消耗和提升性能。
- **setTimeout**：可能因为计时不精准导致性能问题，尤其是当设置的延时小于浏览器的最小延时限制时，或者当回调函数的执行跟浏览器的绘制周期不同步时。

### 精度

- **requestAnimationFrame**: 提供了与浏览器重绘过程同步的精确时机，可以接收一个精确到毫秒的时间戳参数，这对于动画和视觉效果的平滑性至关重要。
- **setTimeout**: 延时的精度受到JavaScript事件循环和浏览器最小延时设置(通常 ~4ms)的影响，而且可能会受到其他任务和系统负载的影响。

### 使用场景

- **requestAnimationFrame**：适合需要高频更新并与浏览器渲染周期同步的场景，如动画、页面滚动效果等。
- **setTimeout**：适合不需要与浏览器绘制周期同步的一般延时任务，例如延迟消息提示、延时请求等。

### 取消机制

- **requestAnimationFrame**：使用`cancelAnimationFrame`来取消已经调度的回调。
- **setTimeout**：使用`clearTimeout`来取消已经调度的回调。

## 总结

总的来说，`requestAnimationFrame` 提供了一种浏览器优化的方法来执行动画和绘制操作，使其能够尽可能平滑并减少页面卡顿的现象。与之前的定时器函数相比（如 `setTimeout` 和 `setInterval`），`requestAnimationFrame` 更适合进行动画绘制，因为它可以根据浏览器的绘制能力智能调整执行频率，避免不必要的性能开销，并且更好地与浏览器渲染流程集成。