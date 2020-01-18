"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ComponentModule = _interopRequireDefault(require("./Component.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Expo
 */
var Button = function Button(_ref) {
  var children = _ref.children,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'default' : _ref$type,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '' : _ref$title,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$htmlType = _ref.htmlType,
      htmlType = _ref$htmlType === void 0 ? 'button' : _ref$htmlType,
      icon = _ref.icon,
      _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? false : _ref$loading,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'xs' : _ref$size,
      _ref$block = _ref.block,
      block = _ref$block === void 0 ? false : _ref$block,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      dataTestId = _ref.dataTestId,
      onClick = _ref.onClick;
  return _react.default.createElement("button", {
    type: htmlType,
    title: title,
    disabled: disabled,
    className: (0, _classnames.default)(_ComponentModule.default.component, _ComponentModule.default[type], _ComponentModule.default[size], _defineProperty({}, _ComponentModule.default.block, block), className),
    onClick: onClick,
    "data-test-id": dataTestId
  }, icon && icon, children);
};

exports.Button = Button;