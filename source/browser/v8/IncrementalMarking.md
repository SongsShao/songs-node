---
title: 垃圾回收：增量标记（Incremental Marking）算法
# permalink: /browser/v8/IncrementalMarking.html
date: 2024年04月30日16:49:23
# description: 增量标记（Incremental Marking）算法是为了解决传统标记-清除和标记-整理算法中的长暂停时间（Stop-The-World）问题而设计的一种垃圾回收策略。在增量标记中，标记阶段被分割成许多小的步骤，这些步骤交错执行，夹杂在应用程序的运行过程中，从而确保每次停顿时间都比较短。
# tag: [前端, javascript, v8]
# comments: true
# categories: 
#  - 浏览器
#  - javascript
#  - v8
---

增量标记（Incremental Marking）算法是为了解决传统标记-清除和标记-整理算法中的长暂停时间（Stop-The-World）问题而设计的一种垃圾回收策略。在增量标记中，标记阶段被分割成许多小的步骤，这些步骤交错执行，夹杂在应用程序的运行过程中，从而确保每次停顿时间都比较短。

## 增量标记算法的逻辑过程

1. **初始标记（Initial Mark）**：
   - 这是一个快速标记过程，标记所有从根对象直接可达的对象。

2. **增量标记（Incremental Mark）**：
   - 在此阶段，垃圾回收器断续运行，每次执行一小部分标记工作，标记从已标记对象间接可达的对象。
   - 为了允许应用程序和垃圾回收器交错执行，标记工作被分割成很多小的任务。

3. **最终标记（Final Mark）**：
   - 这个阶段完成了增量标记中尚未完成的工作，确保所有可达对象都已标记。

4. **清除（Sweep）**：
   - 经过标记阶段后，所有未标记的对象都是不可达的，可以被清除。
   - 清除同样可以分割成小的任务，以减少应用的停顿时间。

## 使用 JavaScript 代码模拟增量标记算法

```javascript
class HeapObject {
  constructor(data) {
    this.data = data;
    this.marked = false;
  }
}

class IncrementalGC {
  constructor(objects) {
    this.objects = objects; // 模拟对象堆
    this.markQueue = []; // 标记队列，模拟待处理的标记工作
  }

  // 初始标记：标记从根可达的对象
  initialMark(rootRefs) {
    for (let rootRef of rootRefs) {
      rootRef.marked = true;
      this.markQueue.push(rootRef);
    }
    this.processQueue(); // 处理一部分标记队列
  }

  // 增量标记：每次调用标记一部分对象
  incrementallyMark() {
    if (this.markQueue.length > 0) {
      this.processQueue();
    } else {
      console.log('Incremental marking complete');
    }
  }

  // 模拟处理标记队列的过程
  processQueue() {
    if (this.markQueue.length === 0) return;
    const obj = this.markQueue.shift(); // 取出第一个待处理对象

    // 从这个对象出发，模拟标记它的引用（通常这会需要判断对象的属性值）
    // 为了简化模型，我们这里忽略对象间的引用关系
  }

  // 清除未标记的对象
  sweep() {
    this.objects = this.objects.filter(obj => obj.marked);
  }
}

const objects = [new HeapObject('obj1'), new HeapObject('obj2')]; // 模拟的对象堆
const gc = new IncrementalGC(objects);
const roots = [objects[0]]; // 模拟根引用集合

gc.initialMark(roots); // 初始标记阶段

// 模拟运行时环境，逐步完成标记
const intervalId = setInterval(() => {
  gc.incrementallyMark();
  
  if (gc.markQueue.length === 0) {
    clearInterval(intervalId);
    gc.sweep(); // 清除阶段，这也可以分步进行
    console.log(objects); // 这里应该只有被标记的objects[0]
  }
}, 0);

```

在上面的代码中，我们定义了 `HeapObject` 类来表示堆中的对象。我们还定义了一个 `IncrementalGC` 类，它拥有一系列对象，一个标记队列用于增量标记过程，并实现了 `initialMark`, `incrementallyMark`, 和 `sweep` 方法来执行垃圾回收的各个阶段。

`initialMark` 方法将模拟根对象直接可达的对象标记为存活，这些对象则被放入 `markQueue` 中以进行后续的增量标记阶段。

`incrementallyMark` 方法在特定的时间间隔运行（例如，它可以由 JavaScript 事件循环在其他任务之间定期触发），每次执行时它会处理一部分标记队列。真实的垃圾回收器可能会使用更复杂的方法来确定何时进行增量标记，以及每次应该标记多少对象，但在这个模拟中，我们在每个间隔只处理队列中的一个对象。

`processQueue` 方法模拟处理标记队列，并将计划标记的对象标记为存活。在这个简化的模型中，我们没有模拟对象引用其他对象的情况，这通常在真实的增量标记中非常重要。

`incrementallyMark` 方法在标记完所有对象后输出完成标记的消息。随后，清除阶段开始，`sweep` 方法过滤出所有未标记的对象，模拟了清除这些对象的垃圾回收过程。

在最后，我们通过 `setInterval` 函数周期性地调用 `incrementallyMark` 方法，模仿增量标记中的“工作时间切片”。一旦所有的标记任务完成，清除 `intervalId` 定时器，执行 `sweep` 方法，结束垃圾回收。

在控制台输出中，我们应该只看到之前被标记为存活的对象，模拟了这些对象是如何被保留下来的，而未标记的对象则被过滤掉，模拟了它们的内存被回收。

请记住，这只是一个非常基础的模拟，旨在帮助理解增量标记算法的基本思想。真实世界中，垃圾回收器更加复杂，会涉及优化技术、堆内存的结构和管理、对象的分代收集等多个方面，而且通常是由底层语言实现的，并且完全隐藏在 JavaScript 运行时环境中。
