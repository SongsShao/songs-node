import { createFiberRoot } from "./ReactFiberRoot";
import {
  createUpdate,
  enqueueUpdate,
  entangleTransitions,
} from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(container) {
  return createFiberRoot(container);
}

/**
 * 更新容器, 把虚拟DOM变成真实DOM 插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container 容器   FiberRootNode
 */
export function updateContainer(element, container) {
  // 获取根fiber
  const current = container.current;
  // 创建更新队列x
  const update = createUpdate();
  update.payload = { element };
  // 3. 把此更新任务对象添加到current这个根Fiber的更新队列里

  let root = enqueueUpdate(current, update);
  console.log(root);

  scheduleUpdateOnFiber(root);
  entangleTransitions(root, current);
}
