import { createContainer } from "../react-reconciler/src/ReactFiberReconciler";

function ReactDomRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDomRoot(root);
}
