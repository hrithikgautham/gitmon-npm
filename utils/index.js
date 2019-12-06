const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { getHash } = require('block-pow');
// const gzip = require('zlib').createGzip();

async function folderize(userFolderName) {
    // userFolderName is the absolute path from the root directory of the user
    try {
        const actualPath = path.join(__dirname, "..", userFolderName); // ..
        await fsPromises.mkdir(actualPath);
        return actualPath;
    }
    catch(err) {
        console.error("Error: directory already exists! err: ", err);
    }
}

async function gittify(
    folderName, 
    {   
        srcFolder,
        numOfChars,
        HALG,
        ext,
        deleteSrc
    }
) {
    try {
        if(numOfChars < 0)
            throw new Error('numChars cannot be negative!');
        const availableHashingAlgorithms = ['sha256', 'sha512', 'sha1'];
        const availableExtensions = ['.json', '.txt', ""];
        const mp = new Map([
            ['sha256', 64],
            ['sha512', 128],
            ['sha1', 40]
        ]);
        if(!availableHashingAlgorithms.includes(HALG))
            throw new Error(`${HALG} hash algorithm is unavailable!`);
        if(numOfChars >= mp[HALG])
            throw new Error(`number of characters for forder name cannot exceed ${mp[HALG]} for ${HALG} hash algorithm!`);
        if(!availableExtensions.includes(ext))
            throw new Error(`${ext} extension not available`);
        let sourcePath; // ..
        let fileNames = srcFolder;
        const isSrcFolderString = typeof srcFolder === 'string';
        if(isSrcFolderString){
            sourcePath = path.join(__dirname, "..", srcFolder);
            fileNames = await fsPromises.readdir(sourcePath);
        }
        for(let i = 0 ; i < fileNames.length ; i++) {
            let originalFile;
            let data = fileNames[i];
            if(isSrcFolderString) { // if srcPath is a string, readFile
                originalFile = path.join(sourcePath, fileNames[i]); 
                data = await fsPromises.readFile(originalFile, 'utf8');
            }
            data = JSON.stringify(data);
            const hash = await getHash(data, "", "", HALG);
            const folderizeFiles = await fsPromises.readdir(folderName);
            // for(let i = 0 ; i < folderizeFiles ; i++) {
            const dir = hash.slice(0, numOfChars);
            if(!folderizeFiles.includes(dir) && dir !== '')
                await fsPromises.mkdir(path.join(folderName, dir));
            const targetFileName = hash.slice(numOfChars, hash.length);
            const targetFileNameWithExt = ext === "" ? targetFileName : `${targetFileName}.${ext}`;
            await fsPromises
                    .writeFile(
                        path.join(
                            folderName, 
                            dir, 
                            targetFileNameWithExt
                        ), 
                        data
                    );// uncompressed
        }
        if(isSrcFolderString) {
            if(deleteSrc === false)
                return;
            else if(deleteSrc === true || deleteSrc === 'onlyFiles'){
                for(let i = 0 ; i < fileNames.length ; i++)
                    await fsPromises.unlink(path.join(sourcePath, fileNames[i]));
                if(deleteSrc === true)
                    await fsPromises.rmdir(sourcePath);
            }
            else
                throw new Error('invalid value given for deleteSrc');
        }
    }
    catch(err) {
        console.error("Error: ", err);
    }
}

module.exports = { folderize, gittify };
