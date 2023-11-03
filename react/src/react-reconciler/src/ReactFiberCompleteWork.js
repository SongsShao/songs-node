import { enableCache } from "../../shared/ReactFeatureFlags";
import { Passive } from "./ReactFiberFlags";

export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot: {
      updateHostContainer(current, workInProgress);
      return null;
    }
    case HostComponent:
      return updateHostComponent(current, workInProgress);

    case HostText:
      return null;
    default:
      return null;
  }
}

function updateHostContainer(current, workInProgress) {
  const portalOrRoot = workInProgress.stateNode;
  // 检测fiber是否发生改变 true 未改变
  const childrenUnchanged = hadNoMutationsEffects(current, workInProgress);
  if (childrenUnchanged) {
    // 不需要处理
  } else {
    const container = portalOrRoot.containerInfo;
    appendAllChildrenToContainer(
      newChildSet,
      workInProgress,
      /* needsVisibilityToggle */ false,
      /* isHidden */ false
    );
  }
}
