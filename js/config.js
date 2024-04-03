function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
if (!window.NexT) window.NexT = {};
(function () {
  var className = 'next-config';
  var staticConfig = {};
  var variableConfig = {};
  var parse = function parse(text) {
    return JSON.parse(text || '{}');
  };
  var update = function update(name) {
    var targetEle = document.querySelector(".".concat(className, "[data-name=\"").concat(name, "\"]"));
    if (!targetEle) return;
    var parsedConfig = parse(targetEle.text);
    if (name === 'main') {
      Object.assign(staticConfig, parsedConfig);
    } else {
      variableConfig[name] = parsedConfig;
    }
  };
  update('main');
  window.CONFIG = new Proxy({}, {
    get: function get(overrideConfig, name) {
      var existing;
      if (name in staticConfig) {
        existing = staticConfig[name];
      } else {
        if (!(name in variableConfig)) update(name);
        existing = variableConfig[name];
      }

      // For unset override and mixable existing
      if (!(name in overrideConfig) && _typeof(existing) === 'object') {
        // Get ready to mix.
        overrideConfig[name] = {};
      }
      if (name in overrideConfig) {
        var override = overrideConfig[name];

        // When mixable
        if (_typeof(override) === 'object' && _typeof(existing) === 'object') {
          // Mix, proxy changes to the override.
          return new Proxy(_objectSpread(_objectSpread({}, existing), override), {
            set: function set(target, prop, value) {
              target[prop] = value;
              override[prop] = value;
              return true;
            }
          });
        }
        return override;
      }

      // Only when not mixable and override hasn't been set.
      return existing;
    }
  });
  document.addEventListener('pjax:success', function () {
    variableConfig = {};
  });
})();