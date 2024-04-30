---
title: 垃圾回收：标记-清除（Mark-Sweep）算法
# permalink: /browser/v8/MarkSweep.html
date: 2024年04月30日16:24:46
# description: 标记-清除（Mark-Sweep）算法是一种常见的垃圾回收（GC）机制，主要用于自动管理编程语言的内存。这种算法通过两个阶段的操作来回收内存：标记（Mark）阶段和清除（Sweep）阶段。
# tag: [前端, javascript, v8]
# comments: true
# categories: 
#  - 浏览器
#  - javascript
#  - v8
---

标记-清除（Mark-Sweep）算法是一种常见的垃圾回收（GC）机制，主要用于自动管理编程语言的内存。这种算法通过两个阶段的操作来回收内存：标记（Mark）阶段和清除（Sweep）阶段。

## 标记阶段

在标记阶段，垃圾回收器遍历所有的活动对象，即那些从根集合（root set，通常包括全局变量、在执行栈上的变量等）可达的对象。遍历的过程中，垃圾回收器“标记”这些被访问的对象。标记通常是通过在对象的元数据中设置一个位来完成的，以表示该对象是活动的，不应被回收。

## 清除阶段

标记完成后，清除阶段开始。在清除阶段，垃圾回收器再次遍历堆内存中的所有对象，这次是为了查找未被标记的对象。未被标记的对象被认为是不可达的，即它们不再被程序使用或者无法从根集合访问到。这些未标记的对象随后会被回收，释放它们占用的内存以供程序后续使用。

## 特点与挑战

优点：标记-清除算法的主要优点在于它的概念相对简单，可以有效地回收不再被需要的内存空间。与引用计数（另一种内存回收机制）相比，它能够回收循环引用的对象。
暂停时间：一个挑战是标记-清除算法在执行期间会引起程序的暂停（Stop-The-World），尤其是在较大的堆或者大量存活对象的情况下，这可能导致程序响应性降低。
内存碎片：标记-清除算法可能会导致内存碎片化，因为它仅仅清除了不可达的对象，没有移动存活的对象。这可能将可用内存分割成小的片段，影响到后续内存分配的效率。

## 优化

为了减少暂停时间和解决内存碎片化问题，现代的垃圾回收器经常结合使用多种策略和算法，如：

增量标记（Incremental Marking）：将标记阶段分成多个小步骤执行，交替执行程序代码和标记代码，减少长时间的暂停。
并发标记（Concurrent Marking）：在程序运行的同时进行标记阶段，通过多线程技术实现。
压缩（Compaction）：在清除阶段或之后进行，将存活的对象移动到内存的一端，以此减少内存碎片。

## js代码模拟标记-清除（Mark-Sweep）算法

要使用 JavaScript 代码模拟标记-清除垃圾回收算法，我们需要模拟内存管理和跟踪对象引用。以下是一个简化模拟代码示例，以帮助了解如何实现标记-清除算法。

首先，我们将创建几个类以表示对象、堆和垃圾回收器：

```js
class HeapObject {
  constructor() {
    this.marked = false;
  }
}

class Heap {
  constructor() {
    this.objects = [];
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  removeObject(obj) {
    const index = this.objects.indexOf(obj);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }
}

class GarbageCollector {
  constructor(heap) {
    this.heap = heap;
    this.roots = new Set(); // 根集合
  }

  // 模拟应用程序创建一个对象，并把它添加到根集合中
  newObject() {
    const obj = new HeapObject();
    this.heap.addObject(obj);
    this.roots.add(obj);
    return obj;
  }

  // 模拟删除根集合中的引用
  removeObjectFromRoots(obj) {
    this.roots.delete(obj);
  }

  // 标记阶段
  mark() {
    this.heap.objects.forEach(obj => (obj.marked = false)); // 清除旧的标记
    this.roots.forEach(root => this.markFrom(root)); // 从根集合开始标记
  }

  // 从一个对象开始递归地标记所有可达对象（在真实的垃圾回收器中这通常更复杂）
  markFrom(obj) {
    if (!obj.marked) {
      obj.marked = true;
      // 如果此对象有引用其他对象，我们需要递归标记
      // 由于我们的模型很简单，这里我们忽略了这一部分
    }
  }

  // 清除阶段
  sweep() {
    let i = 0;
    while (i < this.heap.objects.length) {
      const obj = this.heap.objects[i];
      if (!obj.marked) {
        this.heap.removeObject(obj); // 清除未标记的对象
      } else {
        i++;
      }
    }
  }

  // 运行完整的标记-清除过程
  gc() {
    this.mark();
    this.sweep();
  }
}

// 创建一个模拟堆
const heap = new Heap();
// 创建一个垃圾收集器
const gc = new GarbageCollector(heap);

// 模拟对象的创建和垃圾收集
const obj1 = gc.newObject(); // 创建一个新对象
const obj2 = gc.newObject(); // 创建另一个新对象

gc.removeObjectFromRoots(obj1); // 移除 obj1 的引用
gc.gc(); // 运行垃圾回收

console.log(heap.objects); // 只包含 'obj2'
```

在上述模拟示例中，HeapObject 类表示堆中的对象，每个对象都有一个 marked 属性，用于标记阶段。Heap 类模拟堆内存，提供添加和移除对象的方法。GarbageCollector 类是我们的简化垃圾回收器，它使用标记和清除的方法来管理堆内存中的对象。

在这个模拟中，我们假设所有的对象都是单独的，没有关系或属性连接它们。在现实中，标记过程会递归遍历所有可从根集合到达的对象。同样，这个简化的模型没有考虑对象间的关联或对象的特定数据结构，这些都在真实世界的标记-清除垃圾回收算法中非常重要。

需要注意的是，这个模拟仅用于演示目的，以帮助理解标记-清除算法的基本原理，它并不反映实际的 JavaScript 垃圾回收行为。在实际的 JavaScript 引擎中，垃圾回收过程是隐藏在底层的，且具有许多复杂性，包括内存管理、对象追踪和内存分配优化等。

总之，在这个简易的模拟中，垃圾回收器通过两个阶段进行工作：

标记（Mark）阶段：垃圾回收器从根集合出发去标记所有可以到达的对象，意味着这些对象目前被程序使用中，所以不应该被清除。

清除（Sweep）阶段：垃圾回收器遍历堆中所有的对象，检查它们是否被标记。未被标记的对象会在这个阶段被清除收回，因为它们已经不再被程序使用。

请注意，此模拟中的GarbageCollector对象提供了一个手动触发垃圾回收的方法gc()，这不是在实际JavaScript应用程序中可以做的。真实的JavaScript垃圾回收器会根据内存压力和其他启发式算法自动触发垃圾回收。

此外，为了增加真实感，代码中可能加入对象之间的关联（例如对象属性引用其他对象），从而在标记过程中需要进行递归遍历。由于 JavaScript 的特性和环境限制，这里的模拟只能提供一个原理层面的理解，而不是一个可以实际运行的垃圾回收器。在 JS 中，创建和管理内存是被隐藏起来的，由 JS 引擎自身处理。

## 总结

标记-清除算法是理解现代垃圾回收器工作原理的基础，而实际的垃圾回收器往往通过结合多种技术来优化性能和减少对程序执行的干扰。

