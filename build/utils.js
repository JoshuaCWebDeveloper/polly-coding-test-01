/* utils.js
 * Utility methods
 * Dependencies: node-fetch modules, services, classes
 * Author: Joshua Carter
 * Created: February 1, 2021
 */
"use strict"; //import dependencies

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = fetchFail;
exports.log = log;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

// fetch wrapper that rejects failed requests
function fetchFail() {
  return _fetchFail.apply(this, arguments);
}

function _fetchFail() {
  _fetchFail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", _nodeFetch["default"].apply(void 0, _args).then(function (res) {
              if (!res.status || res.status < 100 || res.status >= 400) {
                throw res;
              }

              return res;
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchFail.apply(this, arguments);
}

function log(obj) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "log";
  console[level](obj);
}