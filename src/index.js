require("@babel/polyfill");
require("dotenv").config();
import Figma from "figma-js";

import { saveImageToFs } from "./saveFile";

const getItemsFromFrames = itemDocument => {
  const items = [];
  itemDocument.children.forEach(frame => {
    frame.children
      .filter(item => item.type === "COMPONENT")
      .forEach(item => {
        items.push({ id: item.id, name: item.name });
      });
  });
  return items;
};

const getFigmaAssets = async ({
  fileId,
  documentId,
  fileExtension = "svg",
  personalAccessToken = process.env.FIGMA_TOKEN,
  output = "icons"
}) => {
  const client = Figma.Client({
    personalAccessToken
  });

  try {
    console.log("Getting file information..");
    const file = await client.file(fileId);
    const itemDocument = file.data.document.children.find(
      doc => doc.id === documentId
    );
    console.log(`Found document "${itemDocument.name}"`);
    const items = await getItemsFromFrames(itemDocument);
    if (items.length === 0) throw "no items found";
    console.log(`Found ${items.length} items, generating...`);

    const itemIds = items.map(item => item.id);

    const response = await client.fileImages(fileId, {
      ids: itemIds,
      format: fileExtension,
      scale: 1
    });
    if (response.data.err) {
      throw response.data.err;
    } else {
      let { images } = response.data;
      const itemsWithUrls = items.map(item => {
        if (images.hasOwnProperty(item.id)) {
          item.url = images[item.id];
          return item;
        }
      });
      itemsWithUrls.forEach(item => {
        let name = item.name.replace(/\/|\./g, "_");
        saveImageToFs(item.url, `${name}.${fileExtension}`, output);
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export { getFigmaAssets };
