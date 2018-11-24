# Figma Assets Generator

Creates assets (SVG, JPG, PNG) from a figma document (e.g. a "Icons" page in one of your files) and places them locally in a folder.

## Usage

Ideal use: create a script in your package.json and run the script whenever you need, however you could also run this programmatically.

### Installation

```
npm install --save-dev figma-assets-generator
```

or

```
yarn add -D figma-assets-generator
```

### Use as npm script

Provide a `figma-assets-generator.json` file with the following configuration:

```
{
  "personalAccessToken": "YOUR_ACCESS_TOKEN",  // required: your figma access token (you can provide this as FIGMA_TOKEN in a .env file)
  "fileId": "YOUR_FILE_IDE", // required: file id where your icons document is stored
  "documentId": "123:456", // required: node of your icons document, e.g. "453:8089"
  "fileExtension": "svg", // optional: ["svg", "jpg", "png"], default: svg
  "output": "assets" // optional: folder where icons will be saved to, defaults to "icons" (cannot have subdirectories, see #17)
}
```

Run

```
npx figma-assets-generator
```

on the command line, or via `node_modules/.bin/figma_assets_generator`

or create a new entry in `package.json` under `scripts`:

```
"figma-generate": "figma-assets-generator"
```

`// Todo:` If no figma-assets-generator.json file was provided a wild wizard appears!

### Use within your \*.js files

Include `figma-assets-generator` in your project, provide required options and call `getFigmaAssets(options)` whenever you want to pull and create icons.

```
const { getFigmaAssets } = require("figma-assets-generator")

const options = {
  personalAccessToken: "5316-049f89713-0134-46b5-b426-22d1251cbc6",  // required: your figma access token (you can provide this as FIGMA_TOKEN in a .env file)
  fileId: "gAMN5xYfhC2BTVKnht3PAk43", // required: file id where your icons document is stored
  documentId: "453:8089", // required: node of your icons document, e.g. "453:8089"
  fileExtension: "svg", // optional: ["svg", "jpg", "png"], default: svg
  output: "assets" // optional: folder where icons will be saved to, defaults to "icons" (cannot have subdirectories, see #17)
}

getFigmaAssets(options)
```

## Caveats

Currently doesn't work with subdirectories. Replaces `/` and `.` with `_` to work around that.
