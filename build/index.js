"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFigmaAssets = void 0;

var _figmaJs = _interopRequireDefault(require("figma-js"));

var _saveFile = require("./saveFile");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("@babel/polyfill");

require("dotenv").config();

var getItemsFromFrames = function getItemsFromFrames(itemDocument) {
  var items = [];
  itemDocument.children.forEach(function (frame) {
    frame.children.filter(function (item) {
      return item.type === "COMPONENT";
    }).forEach(function (item) {
      items.push({
        id: item.id,
        name: item.name
      });
    });
  });
  return items;
};

var getFigmaAssets =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var fileId, documentId, _ref$fileExtension, fileExtension, _ref$personalAccessTo, personalAccessToken, _ref$output, output, client, file, itemDocument, items, itemIds, response, images, itemsWithUrls;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileId = _ref.fileId, documentId = _ref.documentId, _ref$fileExtension = _ref.fileExtension, fileExtension = _ref$fileExtension === void 0 ? "svg" : _ref$fileExtension, _ref$personalAccessTo = _ref.personalAccessToken, personalAccessToken = _ref$personalAccessTo === void 0 ? process.env.FIGMA_TOKEN : _ref$personalAccessTo, _ref$output = _ref.output, output = _ref$output === void 0 ? "icons" : _ref$output;
            client = _figmaJs.default.Client({
              personalAccessToken: personalAccessToken
            });
            _context.prev = 2;
            console.log("Getting file information..");
            _context.next = 6;
            return client.file(fileId);

          case 6:
            file = _context.sent;
            itemDocument = file.data.document.children.find(function (doc) {
              return doc.id === documentId;
            });
            console.log("Found document \"".concat(itemDocument.name, "\""));
            _context.next = 11;
            return getItemsFromFrames(itemDocument);

          case 11:
            items = _context.sent;

            if (!(items.length === 0)) {
              _context.next = 14;
              break;
            }

            throw "no items found";

          case 14:
            console.log("Found ".concat(items.length, " items, generating..."));
            itemIds = items.map(function (item) {
              return item.id;
            });
            _context.next = 18;
            return client.fileImages(fileId, {
              ids: itemIds,
              format: fileExtension,
              scale: 1
            });

          case 18:
            response = _context.sent;

            if (!response.data.err) {
              _context.next = 23;
              break;
            }

            throw response.data.err;

          case 23:
            images = response.data.images;
            itemsWithUrls = items.map(function (item) {
              if (images.hasOwnProperty(item.id)) {
                item.url = images[item.id];
                return item;
              }
            });
            itemsWithUrls.forEach(function (item) {
              var name = item.name.replace(/\/|\./g, "_");
              (0, _saveFile.saveImageToFs)(item.url, "".concat(name, ".").concat(fileExtension), output);
            });

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 28]]);
  }));

  return function getFigmaAssets(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getFigmaAssets = getFigmaAssets;