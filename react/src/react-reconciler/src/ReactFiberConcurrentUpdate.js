import { HostRoot } from './ReactWorkTags';


/**
 * 本来此文件要处理更新优先级问题，把不同的fiber优先级冒泡一路标记到根节点。
 * 目前现在值实现向上冒泡找到根节点
 * @param {*} sourceFiber
 */

export function markUpdateLaneFromFiberToRoot(sourceFiber) {
    // 当前父fiber
    let parent = sourceFiber.return;
    // 当前fiber
    let node = sourceFiber;

    // 一直找到 父fiber 为null
    while(parent !== null) {
        node = parent;
        parent = parent.return;
    }
    // 返回当前root节点
    if(node.tag === HostRoot) {
        const root = node.stateNode;
        return root;
    }
    return null;
}