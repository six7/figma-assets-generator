import fetch from 'node-fetch';
import fs from 'fs';

require('@babel/polyfill');

const saveImageToFs = async (url, imageName, fileExtension, output, createSubdirectories) => {
  try {
    const imageNameArray = imageName.split('/');
    const subfolder = imageNameArray.slice(0, -1).join('/');
    const name = createSubdirectories ? imageName : imageName.replace(/[\/.]/g, '_');
    const fileName = `${name}.${fileExtension}`;

    const response = await fetch(url, {});
    if (response.status !== 200) return;
    if (createSubdirectories && !fs.existsSync(`${output}/${subfolder}`)) {
      fs.mkdirSync(`${output}/${subfolder}`, { recursive: true });
    }
    const content = await response.text();
    fs.writeFileSync(`${output}/${fileName}`, content);
  } catch (e) {
    throw e;
  }
};

export { saveImageToFs };
