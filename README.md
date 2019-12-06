# gitmon
Simple way to make your folders look like .git/objects folder.
## *USAGE:*
<code>
    const { folderize, gittify } = require('gitmon');<br>const path = require('path');<br>
    const targetFolder = path.join(__dirname, "new-folder"); <br>/* path.join() is necessary here(because you need to specify __dirname) */<br>
    const srcFolder = path.join(__dirname, 'src-folder');<br>/*absolute path from root folder.*/<br>/* srcFolder can also be an array*/<br>
    const numOfChars = 2;<br>
    const HALG = 'sha256';<br>
    const deleteSrc = true;<br>
    const ext = '.txt';<br><br>
    async function func() {<br>
    await folderize(targetFolder);<br>/*create folder*/<br>await gittify(targetFolder,<br>{<br><blockquote>srcFolder,<br>numOfChars,<br>HALG,<br>deleteSrc,<br>ext</blockquote>});<br>
    }<br>
    /*arrange the files similar to .git/objects folder*/<br>
    func();<br>
</code>

## *Explanation:*<br>
* First things first! Import the module.
* The parameter to the *folderize* function is a *string*, specifying the name target folder to be generated.
* *folderize* just creates a folder.
* In the above code, *path* module is used to create path string.
* Now, ***srcFolder*** has the required files which has to be converted to *.git/objects* folder.
* ***srcFolder*** can also have nested *folders*. Only the files will be considered. i.e; all the files, no matter how deep they are in ***srcFolder***, will be considered.
* ***srcFolder*** can also be an *Array*, instead of *source folder path*;
* ***numOfChars*** is an *interger*, which indicates the *number of characters from which the folder in ***targetFolder*** has to be named from the hash of the contents of each file in ***srcFolder****.
* The remaining characters in the hash, i.e, (*(size-of-hash)* - ***numOfChars***) remaining charaters of the hash is used to name the *file*, whose hash is used to name the *folder* and the *file*.
* ***ext*** is the extension of the *target* file.
* ***HALG*** is a string specifying the *Hashing Algorithm* to be used in the process.
* E.g, if the ***srcFolder**/sample.txt* is the file you wish to use. Let the hash of the contents of the file be *"abcded639ecb4a3ac95389bbdf05c434e4df5534"(sha1)*, then a folder named *"ab"* will be generated in ***targetFolder***, and the rest of the characters of the hash, i.e, *"cded639ecb4a3ac95389bbdf05c434e4df5534"* will be the name of the file with ***ext*** extension. To summarise, a file named *"cded639ecb4a3ac95389bbdf05c434e4df5534"* with extension ***ext*** can be found in ***targetFolder**/ab*.Hence, the relative path to the file from your working directory is ****targetFolder***/ab/cded639ecb4a3ac95389bbdf05c434e4df5534.***ext****.
* In the above example ***numOfChars*** is chosen to be **2**, thats why the folder is just named with only **2** characters **ab**.
* If ***deleteSrc*** is *true*, then ***srcFolder*** will be *deleted* after conversion (files inside ***srcFolder*** will also be deleted), else the files and ***srcFolder*** remains untouched.

## *Constraints:*<br>
***HALG*** *(string)* can take values which can be found in ['sha1', 'sha256', 'sha512'].<br>
***ext*** *(string)* can take values which can be found in ['.json', '.txt', ""].<br>
***numOfChars*** is an *integer*.<br>
***deleteSrc*** is a *boolean*.<br>
***srcFolder*** and ***targetFolder*** must include **__dirname** in **path.join()**.
<br><br>

# **THANK YOU!**<br>

## For more info, visit [github repo](https://github.com/hrithikgautham/gitmon-npm).
