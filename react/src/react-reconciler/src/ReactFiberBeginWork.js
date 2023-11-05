import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

/**
 * 5. 根据 `新的` 虚拟dom去构建  `新的` fiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @returns 下一个工作单元
 */
export function beginWork(current, workInProgress) {
  /**
  * 在 ReactFiberWorkLoop.new 方法中，以下是一些可能被调用的方法：
  * 
  *  ReactFiberBeginWork.beginWork(current: Fiber | null, unitOfWork: Fiber): Fiber | null：
  *  这个方法用于开始处理工作单元（unitOfWork）的工作。
  *  它会根据工作单元的类型和标记，执行不同的操作，如创建、更新或删除子节点，设置属性和事件等。
  *  
  *  ReactFiberCompleteWork.completeWork(current: Fiber | null, unitOfWork: Fiber): Fiber | null：
  *  这个方法用于完成工作单元的处理。
  *  它会执行一些副作用操作，如调用生命周期方法、处理副作用钩子（如 useEffect、useLayoutEffect）等。
  *  
  *  ReactFiberCommitWork.commitRoot(root: FiberRoot, finishedWork: Fiber): void：
  *  这个方法用于提交根工作单元（finishedWork）的更新。
  *  它会执行最终的 DOM 操作，将新的元素更新到实际的 DOM 中。
  *  
  *  ReactFiberCommitWork.commitLayoutEffects(root: FiberRoot): void：
  *  这个方法用于执行副作用钩子（如 useLayoutEffect）的副作用操作。
  *  它会在 DOM 更新完成后，同步执行副作用钩子的副作用逻辑。
  *  
  *  ReactFiberCommitWork.commitLifeCycles(root: FiberRoot, current: Fiber | null, 
  *    finishedWork: Fiber): void：
  *    这个方法用于执行组件的生命周期方法。
  *    它会在 DOM 更新完成后，按照生命周期的顺序调用组件的相应方法，
  *    如 componentDidMount、componentDidUpdate、componentWillUnmount 等。
  *  
  *  这些方法是在 ReactFiberWorkLoop 模块中定义的，
  *  用于在 Fiber 工作循环中执行具体的工作。ReactFiberWorkLoop.new 
  *  方法会根据工作单元的类型和阶段，调用这些方法来处理工作单元，
  *  并在适当的时候执行 DOM 操作、副作用操作和生命周期方法等。
  *  具体的实现细节可以在 React 源码中相关的文件中找到。
  */
  console.log("beginWork", workInProgress);
  // 判断类型不同处理方式返回子节点或者弟弟
  switch (workInProgress.tag) {
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

/**
 * 根据新的虚拟dom生成新的fiber链表
 * @param {*} current 老的父fiber
 * @param {*} workInProgress 新的父fiber
 * @param {*} nextChildren 新的子虚拟dom
 */
export function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果此时薪fiber 没有老fiber， 说明是新创建
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 更新：协调子fiber列表 需要做DOM-DIFF
    // (初始化时的根fiber是有老fiber的(一开始创建的))
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}
