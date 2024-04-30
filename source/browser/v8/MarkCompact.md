---
title: 垃圾回收：标记-整理（Mark-Compact）算法
# permalink: /browser/v8/MarkCompact.html
date: 2024年04月30日16:33:00
# description: 标记-整理（Mark-Compact）算法，又称为压缩（Compaction）算法，是一种垃圾回收机制，用于解决标记-清除算法导致的内存碎片问题。与标记-清除算法类似，标记-整理算法分为两个阶段：标记阶段和整理阶段。
# tag: [前端, javascript, v8]
# comments: true
# categories: 
#  - 浏览器
#  - javascript
#  - v8
---

标记-整理（Mark-Compact）算法，又称为压缩（Compaction）算法，是一种垃圾回收机制，用于解决标记-清除算法导致的内存碎片问题。与标记-清除算法类似，标记-整理算法分为两个阶段：标记阶段和整理阶段。

## 标记阶段

在标记阶段，垃圾回收器遍历所有从根集合可达的对象，并标记这些对象。

## 整理阶段

在整理阶段，垃圾回收器会移动标记为活动的对象，将它们压缩到内存的一端，从而消除碎片并释放出一整块连续的未使用内存。

标记-整理算法的核心优势是它保留了所有存活对象，同时减少了内存碎片。但这个过程的缺点是需要更多的时间，因为移动对象涉及更多的内存操作。

我们可以用 JavaScript 来模拟标记-整理算法的基本步骤，但请注意，这个模拟是为教育目的，并不是实际的垃圾回收器实现。下面是用JavaScript来模拟的代码示例：

```javascript
class HeapObject {
  constructor(data) {
    this.data = data;
    this.marked = false;
    this.forwardingAddress = null; // 用于压缩时的定位
  }
}

class Heap {
  constructor() {
    this.objects = [];
  }

  addObject(data) {
    const obj = new HeapObject(data);
    this.objects.push(obj);
    return obj;
  }

  compact() {
    const liveObjects = [];
    const deadObjects = [];

    // 分离标记为活动和非活动的对象
    for (const obj of this.objects) {
      if (obj.marked) {
        liveObjects.push(obj);
      } else {
        deadObjects.push(obj);
      }
    }

    // 将所有活动对象移动至内存前端，并更新其转发地址
    this.objects = [];
    for (const obj of liveObjects) {
      obj.forwardingAddress = this.addObject(obj.data);
    }

    // 重置标记状态
    for (const obj of liveObjects) {
      obj.marked = false;
    }

    return deadObjects.length; // 返回清理对象的数量
  }
}

class GC {
  constructor(heap) {
    this.heap = heap;
    this.roots = []; // 根引用数组
  }

  // 模拟创建对象
  createObject(data) {
    const obj = this.heap.addObject(data);
    this.roots.push(obj);
    return obj;
  }

  // 模拟删除根引用
  deleteObject(obj) {
    const index = this.roots.indexOf(obj);
    if (index !== -1) {
      this.roots.splice(index, 1);
    }
  }

  // 标记阶段
  mark() {
    for (const root of this.roots) {
      this.markRecursive(root);
    }
  }

  // 递归标记方法
  markRecursive(obj) {
    if (!obj.marked) {
      obj.marked = true;
      // 如果对象有引用其他对象，递归地标记那些对象
      // 在这个模拟中被忽略了
    }
  }

  // 整理并重新分配对象
  compact() {
    return this.heap.compact();
  }

  // 执行标记-整理垃圾回收
  collectGarbage() {
    this.mark(); // 标记阶段
    return this.compact(); // 整理阶段
  }
}

// 示例使用：

// 创建模拟堆
const heap = new Heap();
// 创建垃圾回收器
const gc = new GC(heap);

// 创建一些对象
const obj1 = gc.createObject('obj1');
const obj2 = gc.createObject('obj2');
const obj3 = gc.createObject('obj3');

// 删除一个对象的引用
gc.deleteObject(obj2);

// 执行垃圾回收
const collected = gc.collectGarbage();
console.log(`收集到 ${collected} 个不可达对象。`);

// 检查堆中剩余的对象
console.log(heap.objects.map(obj => obj.data)); // 应该只显示 'obj1' 和 'obj3'
```

在上面的示例中，我们定义了三个类：`HeapObject`、`Heap` 和 `GC`。

1. `HeapObject` 类代表堆中的对象，包括它的数据、一个标记位（用于标记清除），以及一个转发地址（在整理阶段使用）。
2. `Heap` 类代表内存堆，有一个添加对象的方法和一个紧凑（压缩）方法。紧凑方法会将所有标记的对象移动到数组开始的位置，并更新它们的转发地址。
3. `GC` 类是模拟垃圾收集器。它可以创建对象、删除对象的根引用、进行标记和整理。标记的递归方法假设对象间没有相互引用。在真实的情况下，这可能涉及到一个复杂的引用图。

当 `collectGarbage` 方法被调用时，它首先执行`mark` 方法来标记所有可从根对象集合到达的对象。标记完成后，`compact` 方法会移动所有标记的对象并压缩堆，以减少内存碎片。

此模拟例示提供了对标记-整理（压缩）算法核心工作原理的基本了解。在真正的编程环境中，这个算法的实现细节会非常复杂，且会由底层语言运行时或虚拟机来完成，不会暴露给开发者。
