"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveImageToFs = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("@babel/polyfill");

var saveImageToFs =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url, fileName, output) {
    var response, file;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Fetching ".concat(fileName));
            _context.prev = 1;
            _context.next = 4;
            return (0, _nodeFetch.default)(url);

          case 4:
            response = _context.sent;

            if (!(response.status !== 200)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return");

          case 7:
            if (!_fs.default.existsSync(output)) {
              _fs.default.mkdirSync(output);
            }

            file = _fs.default.createWriteStream("".concat(output, "/").concat(fileName));
            response.body.pipe(file);
            console.log("Saved ".concat(fileName));
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 13]]);
  }));

  return function saveImageToFs(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.saveImageToFs = saveImageToFs;