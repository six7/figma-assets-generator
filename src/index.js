require("@babel/polyfill");
require("dotenv").config();
import fs from "fs";
import * as Figma from "figma-js";
import Listr from "listr";

// import { readConfig } from "./helpers/readConfig";
import { saveImageToFs } from "./helpers/saveImageToFs";

const CONFIG_FILENAME = "figma-assets-generator.json";

const getFigmaAssets = async options => {
  // readConfig(CONFIG_FILENAME, (err, contents) => {
  //   if (err) throw err;
  //   console.log("Found valid configuration file", contents);
  //   configOptions = JSON.parse(contents);
  //   return configOptions;
  // });

  try {
    const config = await JSON.parse(fs.readFileSync(CONFIG_FILENAME, "utf-8"));
    let { fileId, documentId, fileExtension, personalAccessToken, output } =
      options || config;

    output = output || "assets";
    fileExtension = fileExtension || "svg";
    personalAccessToken = personalAccessToken || process.env.FIGMA_TOKEN;
    if (!personalAccessToken) throw new Error("No token specified!");
    if (!fileId) throw new Error("No file id given");
    if (!documentId) throw new Error("No document id given");
    const client = Figma.Client({
      personalAccessToken
    });

    let itemDocument = {};
    let items = [];
    let itemsWithUrls = [];

    const getFileInfo = async task => {
      const file = await client.file(fileId);
      itemDocument = file.data.document.children.find(
        doc => doc.id === documentId
      );
      if (!itemDocument.name) throw new Error("node id not found");
      task.title = `Found document ${itemDocument.name}`;
      return itemDocument;
    };

    const getItemsFromFrames = task => {
      itemDocument.children.forEach(frame => {
        frame.children
          .filter(item => item.type === "COMPONENT")
          .forEach(item => {
            items.push({ id: item.id, name: item.name });
          });
      });
      if (items.length === 0) throw new Error("No items found");
      task.title = `Found ${items.length} items`;
      return items.length;
    };

    const getImageURLs = async task => {
      const itemIds = items.map(item => item.id);

      const response = await client.fileImages(fileId, {
        ids: itemIds,
        format: fileExtension,
        scale: 1
      });
      if (response.data.err) throw response.data.err;
      let { images } = response.data;
      itemsWithUrls = items.map(item => {
        if (images.hasOwnProperty(item.id)) {
          item.url = images[item.id];
          return item;
        }
      });
      task.title = `Found ${itemsWithUrls.length} matching URLs`;
      return itemsWithUrls;
    };

    const saveImages = task => {
      try {
        itemsWithUrls.forEach((item, idx) => {
          let name = item.name.replace(/\/|\./g, "_");
          saveImageToFs(item.url, `${name}.${fileExtension}`, output);
        });
        task.title = `Sucess! Saved images to '${output}'`;
        return itemsWithUrls;
      } catch (e) {
        throw new Error("Error saving images to filesystem");
      }
    };

    let taskItems = [
      {
        title: "Getting document information",
        task: (ctx, task) => getFileInfo(task)
      },
      {
        title: "Find items in document",
        task: (ctx, task) => getItemsFromFrames(task)
      },
      {
        title: "Get image URLs from Figma",
        task: (ctx, task) => getImageURLs(task)
      },
      {
        title: "Save images to filesystem",
        task: (ctx, task) => saveImages(task)
      }
    ];
    let tasks = new Listr(taskItems);

    await tasks.run();
  } catch (e) {
    console.error(e);
  }
};

export { getFigmaAssets };
