"use strict"

const fs = require('fs');
const fsPromises = fs.promises;

async function folderize(userFolderName) {
    // userFolderName is the absolute path from the root directory of the user
    try {
        // const actualPath = path.join(__dirname, "..", userFolderName); // ..
        await fsPromises.mkdir(userFolderName);
    }
    catch(err) {
        throw new Error('folderize failed!');
    }
}

module.exports = folderize;