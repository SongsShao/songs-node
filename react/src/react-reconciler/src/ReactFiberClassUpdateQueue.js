import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdate'
import assign from '../../shared/assgin';

export function initialUpdateQueue(fiber) {
    // 创建一个更新队列
    // pending 是循环链表
    const queue = {
        shared: {
            pending: null,
        }
    }
    fiber.updateQueue = queue;
}

// 更新状态
export const UpdateState = 0;

export function createUpdate() {
    const update = {tag: UpdateState};
    return update;
}

export function enqueueUpdate(fiber, update) {
    // 获取根fiber的更新队列 (上一篇最后加的)
    const updateQueue = fiber.updateQueue;
    // 获取等待执行的任务
    const pending = updateQueue.shared.pending;
    // 说明初始化的状态
    if(pending === null) {
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }
   
    // 让等待更新指向当前update 开始更新
    updateQueue.shared.pending = update;

    // 从当前的fiber 到返回找到并返回根节点

    return markUpdateLaneFromFiberToRoot(fiber);

}

/**
 * 根据老状态和更新队列的更新计算最新的状态
 * @param {*} workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress) {
    // 拿到更新队列
    const queue = workInProgress.updateQueue;
    // 等待生效的队列
    const pendingQueue = queue.shared.pending;
    // 如果有更新, 或者更新队列里有内容
    if(pendingQueue !== null) {
        // 清除等待生效的更新 因为在这就要使用了可以清除了
        queue.shared.pending = null;
        // 获取最后一个等待生效的更新 
        const lastPendingUpdate = pendingQueue;
        // 第一个等待生效的更新
        const firstPendingUpdate = pendingQueue.next;
        // 把更新链表剪开, 变成单向链表
        lastPendingUpdate.next = null;
        // 获取老状态 (会不停更新和计算赋值新状态, 所以起名newState)
        let newState = workInProgress.memoizedState;
        let update = firstPendingUpdate;
        while(update) {
            // 根据老状态和更新计算新状态
            newState = getStateFromUpdate(update, newState);
            update = update.next;
        }

        // 把最终计算到的状态赋值给 memoizedState
        workInProgress.memoizedState = newState;
    }
}

/**
 * 根据老状态和更新, 计算新状态
 * @param {*} update 更新
 * @param {*} prevState 上一个状态
 * @returns 新状态
 */
function getStateFromUpdate(update, prevState) {
    switch(update.tag) {
        case UpdateState:
            const { payload } = update;
            return assign({}, prevState, payload);
    }
}