const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { getHash } = require('block-pow');
// const gzip = require('zlib').createGzip();

async function folderize(userFolderName) {
    // userFolderName is the absolute path from the root directory of the user
    try {
        const actualPath = path.join(__dirname, "..", "..", "..", userFolderName); // ..
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
        srcFolderName,
        numOfChars,
        HALG,
        ext,
        deleteSrc
    }
) {
    try {
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
        const sourcePath = path.join(__dirname, "..", "..", "..", srcFolderName); // ..
        const fileNames = await fsPromises.readdir(sourcePath);
        for(let i = 0 ; i < fileNames.length ; i++) {
            const originalFile = path.join(sourcePath, fileNames[i]);
            const data = await fsPromises.readFile(originalFile, 'utf8');
            const hash = await getHash(data, "", "", HALG);
            const folderizeFiles = await fsPromises.readdir(path.join(folderName));
            // for(let i = 0 ; i < folderizeFiles ; i++) {
            const dir = hash.slice(0, numOfChars);
            if(!folderizeFiles.includes(dir))
                await fsPromises.mkdir(path.join(folderName, dir));
            // await fsPromises.appendFile(path.join(folderName));
            const targetFileName = hash.slice(numOfChars, hash.length);
            const targetFileNameWithExt = ext === "" ? targetFileName : `${targetFileName}.${ext}`;
            await fsPromises.writeFile(path.join(folderName, dir, targetFileNameWithExt), data);// uncompressed
            // fs
            //     .createReadStream(originalFile, 'utf8')
            //     .pipe(gzip)
            //     .pipe(fs.createWriteStream(path.join(folderName, dir)))
            //     .on(error => { throw new Error(error); })
        }
        if(deleteSrc) {
            for(let i = 0 ; i < fileNames.length ; i++) 
                await fsPromises.unlink(path.join(sourcePath, fileNames[i]));
            await fsPromises.rmdir(sourcePath); // delete source folder
        }
    }
    catch(err) {
        console.error("Error: ", err);
    }
}

module.exports = { folderize, gittify };
