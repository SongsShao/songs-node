// 每种虚拟DOM都会对应自己的fiber的类型
// 根Fiber的Tag
export const HostRoot = 3; // 根节点
export const HostComponent = 5; // 原生节点 span div p
export const HostText = 6; // 纯文本节点
// ...
