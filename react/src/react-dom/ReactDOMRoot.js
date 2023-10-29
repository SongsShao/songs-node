import { createContainer } from "../react-reconciler/src/ReactFiberReconciler";
import { updateContainer } from '../react-reconciler/src/ReactFiberReconciler';
function ReactDomRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDomRoot(root);
}

ReactDomRoot.prototype.render = function (children) {
  // 1. 获取容器
  const root = this._internalRoot;
  updateContainer(children, root);
}