import fs from 'fs';
import * as Figma from 'figma-js';
import { Listr } from 'listr2';

import { saveImageToFs } from './helpers/saveImageToFs';
import { mkDirByPathSync } from './helpers/mkDirByPathSync';

require('@babel/polyfill');
require('dotenv').config();

const CONFIG_FILENAME = 'figma-assets-generator.json';

const getConfigFile = async () => {
  try {
    return await JSON.parse(fs.readFileSync(CONFIG_FILENAME, 'utf-8'));
  } catch (e) {
    return {};
  }
};

const getFigmaAssets = async options => {
  try {
    const configFile = await getConfigFile();

    let {
      fileId,
      documentId,
      fileExtension,
      personalAccessToken,
      output,
      scale,
      createSubdirectories,
    } = options || configFile;

    output = output || 'assets';
    fileExtension = fileExtension || 'svg';
    scale = scale || '1';
    createSubdirectories = createSubdirectories || false;
    personalAccessToken = personalAccessToken || process.env.FIGMA_TOKEN;
    if (!personalAccessToken) throw new Error('No token specified!');
    if (!fileId) throw new Error('No file id given');
    if (!documentId) throw new Error('No document id given');
    const client = Figma.Client({
      personalAccessToken,
    });

    let itemDocument = {};
    const items = [];
    let itemsWithUrls = [];

    const getFileInfo = async task => {
      const file = await client.file(fileId);
      itemDocument = file.data.document.children.find(
        doc => doc.id === documentId,
      );
      if (!itemDocument.name) throw new Error('node id not found');
      task.title = `Found document ${itemDocument.name}`;
      return itemDocument;
    };

    const getItemsFromFrames = task => {
      itemDocument.children.forEach(frame => {
        if (frame.children) {
          frame.children
            .filter(item => item.type === 'COMPONENT')
            .forEach(item => {
              items.push({ id: item.id, name: item.name });
            });
        }
      });
      if (items.length === 0) throw new Error('No items found');
      task.title = `Found ${items.length} items`;
      return items.length;
    };

    const getImageURLs = async task => {
      const itemIds = items.map(item => item.id);

      const response = await client.fileImages(fileId, {
        ids: itemIds,
        format: fileExtension,
        use_absolute_bounds: true,
        scale,
      });
      if (response.data.err) throw response.data.err;
      const { images } = response.data;
      itemsWithUrls = items.map(item => {
        if (images.hasOwnProperty(item.id)) {
          item.url = images[item.id];
          return item;
        }
      });
      task.title = `Found ${itemsWithUrls.length} matching URLs`;
      return itemsWithUrls;
    };

    const saveImages = async task => {
      try {
        mkDirByPathSync(output);
        await Promise.all(itemsWithUrls.map(item => {
          return saveImageToFs(item.url, item.name, fileExtension, output, createSubdirectories);
        }));
        task.title = `Success! Saved images to '${output}'`;
        return itemsWithUrls;
      } catch (e) {
        throw new Error('Error saving images to filesystem');
      }
    };

    const taskItems = [
      {
        title: 'Getting document information',
        task: async (ctx, task) => getFileInfo(task),
      },
      {
        title: 'Find items in document',
        task: (ctx, task) => getItemsFromFrames(task),
      },
      {
        title: 'Get image URLs from Figma',
        task: async (ctx, task) => getImageURLs(task),
      },
      {
        title: 'Save images to filesystem',
        task: async (ctx, task) => saveImages(task),
      },
    ];
    const tasks = new Listr(taskItems);

    await tasks.run();
  } catch (e) {
    console.error(e);
  }
};

export { getFigmaAssets };
