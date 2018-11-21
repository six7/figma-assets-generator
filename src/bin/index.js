#!/usr/bin/env node

;("use strict")

require("dotenv").config()
const fs = require("fs")
const { getFigmaAssets } = require("../getFigmaAssets")

const CONFIG_FILENAME = "figma-assets-generator.json"

const readConfig = (filename, callback) => {
  fs.readFile(filename, "utf-8", (err, content) => {
    if (err) {
      callback(err, null)
      return
    }
    callback(null, content)
  })
}

readConfig(CONFIG_FILENAME, function(err, contents) {
  let CONFIG = {}
  if (err) {
    console.log(`No config file (${CONFIG_FILENAME}) found.`)
  } else {
    try {
      CONFIG = JSON.parse(contents)
      console.log("Found valid configuration file!")
      CONFIG.personalAccessToken =
        CONFIG.personalAccessToken || process.env.FIGMA_TOKEN
      getFigmaAssets(CONFIG)
    } catch (err) {
      console.error("ERROR!")
      console.error(err)
    }
  }
})
