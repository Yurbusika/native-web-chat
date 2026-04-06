import path from 'path';
import fs from 'fs/promises';

const __dirname = path.resolve();


const getPublicPath = (filePath) => {
  return path.join(__dirname, 'public', filePath);
};

export const getReadedPublicFile = (filePath) =>
  fs.readFile(getPublicPath(filePath));
