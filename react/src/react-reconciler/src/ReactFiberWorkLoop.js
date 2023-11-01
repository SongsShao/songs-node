import { scheduleCallback } from "./scheduler";
import { creatWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from './ReactFiberCompleteWork';
// 正在进行中的工作

let workInProgress = null;

export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);
}

export function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行performConcurrentWorkOnRoot 参数定死为root
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * (被告知浏览器确保执行的函数)
 * 根据当前的fiber节点构建fiber树, 创建真实的dom节点, 插入到容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  console.log(root, "performConcurrentWorkOnRoot");
  // 1. 初次渲染的时候以同步方式渲染根节点, 因为要尽快展示 (初始化)
  renderRootSync(root);
}

function renderRootSync(root) {
  // 2. 先构建一个空的栈
  prepareFreshStack(root);
  // 1. 现在的 workInProgress 是新的根fiber
  workLoopSync();
}

function prepareFreshStack(root) {
  // 初始化
  workInProgress = creatWorkInProgress(root.current);
}

// 工作同步循环
function workLoopSync() {
  while (workInProgress !== null) {
    // 2. 执行工作单元
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;

  const next = beginWork(current, unitOfWork);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 说明已经完成
    // 完成工作单元
    completeUnitOfWork(unitOfWork); // 这个方法之后写 先模拟一下完成工作
    // workInProgress = null;
  } else {
    // 如果有子节点就成为下一个工作单元
    workInProgress = next;
  }
}


function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    // 拿到他的父节点和当前节点RootFiber
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    let next = completeWork(current, completedWork);
    // 如果下一个节点不为空
    if(next !== null) {
      workInProgress = next;
      return;
    }
    
    const siblingFiber = completedWork.sibling;
    // 如果兄弟节点不为空
    if(siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 返回父节点
    completedWork = returnFiber;

  } while(completedWork !== null);
}