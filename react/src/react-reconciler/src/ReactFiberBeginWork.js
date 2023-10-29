import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

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

/**
 * 根据新的虚拟dom生成新的fiber链表
 * @param {*} current 老的父fiber
 * @param {*} workInProgress 新的父fiber
 * @param {*} nextChildren 新的子虚拟dom
 */
export function reconcileChildren(current, workInProgress, nextChildren) {
    // 如果此时薪fiber 没有老fiber， 说明是新创建
    if(current === null) {
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
    } else {
        // 更新：协调子fiber列表 需要做DOM-DIFF
        // (初始化时的根fiber是有老fiber的(一开始创建的))
        workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren
        )
    }
}
