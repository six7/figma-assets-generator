#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _index = require("../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

require("dotenv").config();

var CONFIG_FILENAME = "figma-assets-generator.json";

var readConfig = function readConfig(filename, callback) {
  _fs.default.readFile(filename, "utf-8", function (err, content) {
    if (err) {
      callback(err, null);
      return;
    }

    callback(null, content);
  });
};

readConfig(CONFIG_FILENAME, function (err, contents) {
  var CONFIG = {};

  if (err) {
    console.log("No config file (".concat(CONFIG_FILENAME, ") found."));
  } else {
    try {
      CONFIG = JSON.parse(contents);
      console.log("Found valid configuration file!");
      CONFIG.personalAccessToken = CONFIG.personalAccessToken || process.env.FIGMA_TOKEN;
      (0, _index.getFigmaAssets)(CONFIG);
    } catch (err) {
      console.error("ERROR!");
      console.error(err);
    }
  }
});