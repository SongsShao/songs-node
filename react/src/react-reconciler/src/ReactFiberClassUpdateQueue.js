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