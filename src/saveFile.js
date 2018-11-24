require("@babel/polyfill");
import fetch from "node-fetch";
import fs from "fs";

const saveImageToFs = async (url, fileName, output) => {
  console.log(`Fetching ${fileName}`);
  try {
    const response = await fetch(url);
    if (response.status !== 200) return;
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output);
    }
    const file = fs.createWriteStream(`${output}/${fileName}`);
    response.body.pipe(file);
    console.log(`Saved ${fileName}`);
  } catch (e) {
    console.error(e);
  }
};

export { saveImageToFs };