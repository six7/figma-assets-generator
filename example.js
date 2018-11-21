const { getFigmaAssets } = require("figma-assets-generator")

const options = {
  personalAccessToken: "5316-049f89713-0134-46b5-b426-22d1251cbc6",  // required: your figma access token (you can provide this as FIGMA_TOKEN in a .env file)
  fileId: "gAMN5xYfhC2BTVKnht3PAk43", // required: file id where your icons document is stored
  documentId: "453:8089", // required: node of your icons document, e.g. "453:8089"
  fileExtension: "svg", // optional: ["svg", "jpg", "png"], default: svg
  output: "assets" // optional: folder where icons will be saved to, defaults to "icons" (cannot have subdirectories, see #17)
}

getFigmaAssets(options)