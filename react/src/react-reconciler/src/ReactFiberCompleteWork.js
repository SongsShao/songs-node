import { enableCache } from '../../shared/ReactFeatureFlags';
import { Passive } from './ReactFiberFlags';

export function completeWork(current, workInProgress) {
    const newProps = workInProgress.pendingProps;
    switch(workInProgress.tag) {
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