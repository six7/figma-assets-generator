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
  "fileExtension": "svg", // optional: ["svg", "jpg", "png", "pdf"], default: svg
  "output": "assets/icons/svg" // optional: folder (relative path from working directory) where icons will be saved to, defaults to "assets",
  "scale": "1" // optional, values between 0.05 and 4 are possible, default: 1
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

#### How do I get fileId and documentId ?
To get the fileId you need to open the document in your browser, the fileId is indicated in the address bar:

https://www.figma.com/file/KiFw6W2QjnKqhA4hoWsrhQ/Untitled?node-id=0%3A123

The part after `/file/` would be the fileId (in this example `KiFw6W2QjnKqhA4hoWsrhQ`) and the documentId would be the part after `node-id=` (in this example `0%3A123` - however `%3A` is just HTML Encoding for `:` so the document id would be `0:123` 

## Caveats

Replaces `/` and `.` in component names with `_`.
