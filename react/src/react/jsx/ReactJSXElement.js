import hasOwnProperty from '../../shared/hasOwnProperty';

// dom 类型
import { REACT_ELEMENT_TYPE  } from '../../shared/ReactSymbols';

const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

function hasValidKey(config) {
    return config.key !== undefined;
}

function hasValidRef(config) {
    return config.ref !== undefined;
}

// ReactElement 创建
function ReactElement(type, key, ref, props, owner) {
    return {
        // 这个标签允许我们唯一地将其标识为React元素
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
        
    }
}


export function jsxDEV(type, config) {
    // 提取保留名称
    const props = {};
    let key = null;
    let ref = null;
    if(hasValidKey(config)) {
        key = config.key;
    }

    if(hasValidRef(config)) {
        ref = config.ref;
    }

    for(const propName in config) {
        if(hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
            props[propName] = config[propName];
        }
    }
    return ReactElement(type, key, ref, props)
}
