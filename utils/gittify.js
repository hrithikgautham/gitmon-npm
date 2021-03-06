const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { getHash } = require('block-pow');
const check = require("../check");

async function gittify(
    targetFolderName = check("target folder name must be provided!"), 
    {   
        srcFolder = check("srcFolder is missing!"),
        numOfChars = check("numOfChars is missing!"),
        HALG = check("HALG is missing!"),
        ext = check("ext is missing!"),
        deleteSrc = typeof srcFolder === 'string' && check("deleteSrc is missing!")
    }
) {
    try {
        // console.log("srcPAth: ", srcFolder);
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
        if(typeof deleteSrc !== 'boolean')
            throw new Error(`deleteSrc must be of type boolean!`);
        // let srcFolder; // ..
        let fileNames = srcFolder;
        const isSrcFolderString = typeof srcFolder === 'string';
        if(isSrcFolderString)
            fileNames = await fsPromises.readdir(srcFolder);
        for(let i = 0 ; i < fileNames.length ; i++) {
            // console.log("stats of this file: ", stats.isDirectory(fileNames[i]));
            let originalFileOrFolder;
            let data = fileNames[i];
            // let stat;
            if(isSrcFolderString) { // if srcPath is a string, readFile
                originalFileOrFolder = path.join(srcFolder, fileNames[i]);
                const stat = await fsPromises.stat(originalFileOrFolder);
                if(stat.isDirectory()){
                    await gittify(
                        targetFolderName,
                        {
                            srcFolder: originalFileOrFolder,
                            numOfChars,
                            HALG,
                            ext,
                            deleteSrc
                        }
                    );
                    continue;
                }
                data = await fsPromises.readFile(originalFileOrFolder, 'utf8');
            }
            data = JSON.stringify(data);
            const hash = await getHash(data, "", "", HALG);
            const folderizeFiles = await fsPromises.readdir(targetFolderName);
            // for(let i = 0 ; i < folderizeFiles ; i++) {
            const dir = hash.slice(0, numOfChars);
            if(!folderizeFiles.includes(dir) && dir !== '')
                await fsPromises.mkdir(path.join(targetFolderName, dir));
            const targetFileName = hash.slice(numOfChars, hash.length);
            const targetFileNameWithExt = ext === "" ? targetFileName : `${targetFileName}.${ext}`;
            await fsPromises
                    .writeFile(
                        path.join(
                            targetFolderName, 
                            dir, 
                            targetFileNameWithExt
                        ),
                        data
                    );
            // uncompressed
        }
        if(isSrcFolderString) {
            if(deleteSrc === true){
                for(let i = 0 ; i < fileNames.length ; i++)
                    await fsPromises.unlink(path.join(srcFolder, fileNames[i]));
                await fsPromises.rmdir(srcFolder);
            }
        }
    }
    catch(err) {
        throw new Error('gittify failed');
    }
}

module.exports = gittify;
