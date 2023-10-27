import { createFiberRoot } from "./ReactFiberRoot";

export function createContainer(container) {
  return createFiberRoot(container);
}
