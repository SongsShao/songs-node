import { createFiberFromElement } from './ReactFiber';
import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
/**
 *
 * @param {*} shouldTrackSideEffect 是否跟踪副作用
 * @returns
 */
function createChildReconciler(shouldTrackSideEffect) {

   function reconcileSingElement(returnFiber, currentFirstFiber, element) {
        // 因为我们实现的是初次挂载, 老节点currentFirstFiber是没有的, 
        // 所以可以直接根据虚拟dom创建fiber节点
        const created = createFiberFromElement(element);
        created.return = returnFiber;
        return created;
    }

    /**
   * 比较子fiber  (DOM-DIFF) 就是用老的fiber链表和新的虚拟dom进行比较
   * @param {*} returnFiber 新父fiber
   * @param {*} currentFirstFiber 当前的第一个子fiber(老fiber的第一个儿子)
   * @param {*} newChild 新的子虚拟dom
   */
    function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
        // 现在暂时只考虑新的节点只有一个的情况
        if(typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return reconcileSingElement(
                        returnFiber,
                        currentFirstFiber,
                        newChild
                    );
                default:
                    break;
            }
        }
    }
    return reconcileChildFibers;
}

// 有老父fiber 更新
export const reconcileChildFibers = createChildReconciler(true);
// 没有老的父fiber 更新
export const mountChildFibers = createChildReconciler(false);