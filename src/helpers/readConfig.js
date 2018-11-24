import fs from "fs";

const readConfig = (filename, callback) => {
  fs.readFile(filename, "utf-8", (err, content) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, content);
  });
};

export { readConfig };
