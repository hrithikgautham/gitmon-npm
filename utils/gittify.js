const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { getHash } = require('block-pow');
const check = require("../check");

async function gittify(
    targetFolderName = check("target folder name must be provided!"), 
    {   
        srcFolder = check("srcFolder(String) is missing!"),
        numOfChars = check("numOfChars(Number) is missing!"),
        HALG = check("HALG(String) is missing!"),
        ext = check("ext(String) is missing!"),
        deleteSrc = typeof srcFolder === 'string' && check("deleteSrc is missing!"),
        sameStruct = check("sameStruct(Boolean) is missing!")
    }
) 
{
    try {
        if(typeof srcFolder !== 'string' && !Array.isArray(srcFolder)) // to checck if it is a string or an array
            throw new Error(`srcFolder must be of type string or array!`);
        if(typeof ext !== 'string' || typeof HALG !== 'string')
            throw new Error(`ext, HALG must be of type string!`);
        if(typeof sameStruct !== 'boolean' || typeof deleteSrc !== 'boolean')
            throw new Error(`sameStruct, deleteSrc must be of type boolean!`);
        if(numOfChars < 0 || typeof numOfChars !== 'number')
            throw new Error('numChars must be of type number and cannot be negative!');
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
            throw new Error(`${ext} extension not available. Please provide extension within this array [".json", ".txt", ""]`);
        await gittifyUtil(
            targetFolderName, 
            {   
                srcFolder,
                numOfChars,
                HALG,
                ext,
                deleteSrc,
                sameStruct
            }
        );
    }
    catch(err) {
        throw err;
    }
}

async function gittifyUtil(
    targetFolderName, 
    {   
        srcFolder,
        numOfChars,
        HALG,
        ext,
        deleteSrc,
        sameStruct
    }
) 
{
    try {
        let fileNames = srcFolder;
        const isSrcFolderString = typeof srcFolder === 'string';
        if(isSrcFolderString)
            fileNames = await fsPromises.readdir(srcFolder);
        for(let i = 0 ; i < fileNames.length ; i++) {
            let originalFileOrFolder;
            let data = fileNames[i];
            if(isSrcFolderString) { // if srcPath is a string, readFile
                originalFileOrFolder = path.join(srcFolder, fileNames[i]);
                const stat = await fsPromises.stat(originalFileOrFolder);
                if(stat.isDirectory()){
                    const temp = targetFolderName;
                    if(sameStruct) {
                        const folderHash = await getHash(data, "", "", HALG); // use the folder name to create the hash for name of the target folder
                        targetFolderName = path.join(targetFolderName, folderHash);
                        await fsPromises.mkdir(targetFolderName);
                    }
                    await gittifyUtil(
                        targetFolderName,
                        {
                            srcFolder: originalFileOrFolder,
                            numOfChars,
                            HALG,
                            ext,
                            deleteSrc,
                            sameStruct
                        }
                    );
                    targetFolderName = temp;
                    continue;
                }
                data = await fsPromises.readFile(originalFileOrFolder, 'utf8');
            }
            data = JSON.stringify(data);
            const hash = await getHash(data, "", "", HALG);
            const folderizeFiles = await fsPromises.readdir(targetFolderName);
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
                    ); // uncompressed
        }
        if(isSrcFolderString) {
            if(deleteSrc){
                for(let i = 0 ; i < fileNames.length ; i++)
                    await fsPromises.unlink(path.join(srcFolder, fileNames[i]));
                await fsPromises.rmdir(srcFolder);
            }
        }
    }
    catch(err) {
        throw err;
    }
}

module.exports = gittify;
