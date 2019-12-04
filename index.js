// what do i need?
// get the folder path from user
// the path should start from path.join("..","..", "user input path")
const path = require('path');
const { folderize, gittify } = require("./utils");

folderize(path.join("django")).then(folderName => {
    gittify(folderName, {
        sourceFolderName: 'temp',
        charactersForFolderName: 5,
        HALG: 'sha1',
        deleteSrc: true,
        ext: '.txt'
    })
}).catch(console.error);