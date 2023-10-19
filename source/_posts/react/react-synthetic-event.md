---
title: React 使用合成事件（SyntheticEvent）
permalink: /react-synthetic-event.html
description: React 使用合成事件（SyntheticEvent）来处理浏览器原生事件的跨浏览器兼容性问题。合成事件是一个封装了原生事件的对象，提供了一致的跨浏览器接口，使您能够在不同浏览器中以一致的方式处理事件。
date: 2023-10-18 21:27:49
tag: [前端, react, JavaScript]
comments: true
categories: 
 - react
---

# React 使用合成事件
React 使用合成事件（SyntheticEvent）来处理浏览器原生事件的跨浏览器兼容性问题。合成事件是一个封装了原生事件的对象，提供了一致的跨浏览器接口，使您能够在不同浏览器中以一致的方式处理事件。
<!-- more -->
在 React 中，您可以通过在组件中定义事件处理函数并将其传递给相应的元素来处理合成事件。例如，您可以在一个按钮上定义一个点击事件处理函数：
```js
class MyComponent extends React.Component {
  handleClick = (event) => {
    console.log('Button clicked!');
  }

  render() {
    return (
      <button onClick={this.handleClick}>Click me!</button>
    );
  }
}
```
在上面的示例中，我们定义了一个名为handleClick的点击事件处理函数，并将其传递给按钮的onClick属性。当按钮被点击时，React 将自动创建一个合成事件对象，并将其作为参数传递给handleClick函数。您可以在事件处理函数中访问合成事件对象，并使用其属性和方法进行操作。

合成事件对象具有与原生事件对象相似的属性和方法，但也有一些额外的属性和方法，用于处理 React 特定的功能。例如，您可以使用event.target来访问触发事件的元素，event.preventDefault()来阻止默认行为，以及event.stopPropagation()来阻止事件冒泡。

请注意，由于合成事件是 React 提供的跨浏览器抽象，它并不是浏览器原生事件对象。因此，某些浏览器特定的功能可能不可用或表现不一致。如果需要访问原生事件对象，您可以使用合成事件对象的nativeEvent属性。
# React合成事件如何阻止事件传播

React合成事件可以通过调用`e.stopPropagation()`来阻止事件传播。
当根容器接收到捕获事件时，先触发一次React事件的捕获阶段，然后再执行原生事件的捕获传播。所以，调用`e.stopPropagation()`可以阻止原生事件的传播。
合成事件是根据事件类型对原生事件的属性进行处理，并包装了关键方法，从而实现了事件的触发和处理。