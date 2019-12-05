# gitmon
Simple way to make your folders look like .git/objects folder.
## *USAGE:*
<code>
    const { folderize, gittify } = require('gitmon');<br>const path = require('path');<br>
    const targetFolder = path.join("new-folder"); <br>/*relative path from the root directory should be used, hence __dirname is not required*/<br>/* path.join() is not necessary here(because only on word is used to describe the folder) */<br>
    const srcFolder = 'oldFolder';<br>
    const numOfChars = 2;<br>
    const HALG = 'sha256';<br>
    const deleteSrc = true; // can also be a string<br>
    const ext = '.txt';<br>
    folderize(targetFolder)<br>.then(targetFolderPath => gittify(targetFolderPath,<br>{<br><blockquote>srcFolder,<br>numOfChars,<br>HALG,<br>deleteSrc,<br>ext</blockquote>}))<br>.catch(err => console.error);
</code>

## *Explanation:*<br>
* First things first! Import the module.
* The parameter to the *folderize* function is a *string*, specifying the target folder to be generated, relative to the root folder in which ur *node_modules* exists.
* In the above code, *path* module is used to create path(relative to your root directory). If u want to create folder in the root directory itself, u can just use *string*, no need for path.join().
* As you can see *__dirname* is not used. This is crucial, as the path.join() must not include *__dirname* as a parameter in *path.join()* for ***targetFolder***.
* Now, ***srcFolder*** *(path relative to root folder without *__dirname*)* has the required files which has to be converted to *.git/objects* folder.
* ***numOfChars*** is an *interger*, which indicates the *number of characters from which the folder in ***targetFolder*** has to be named from the hash of the contents of each file in ***srcFolder****.
* The remaining characters in the hash, i.e, *size-of-hash* - ***numOfChars*** remaining charaters of the hash is used to name the *file*, whose hash is used to name the *folder* and the *file*.
* ***ext*** is the extension of the file.
* ***HALG*** is a string specifying the *Hashing Algorithm* to be used in the process.
* E.g, if the ***srcFolder**/sample.txt* is the file you wish to use. Let the hash of the contents of the file be *"abcded639ecb4a3ac95389bbdf05c434e4df5534"(sha1)*, then a folder named *"ab"* will be generated in ***targetFolder***, and the rest of the characters of the hash, i.e, *"cded639ecb4a3ac95389bbdf05c434e4df5534"* will be the name of the file with ***ext*** extension. To summarise, a file named *"cded639ecb4a3ac95389bbdf05c434e4df5534"* with extension ***ext*** can be found in ***targetFolder**/ab*.Hence, the relative path to the file from root is ****targetFolder***/ab/cded639ecb4a3ac95389bbdf05c434e4df5534.***ext****.
* If ***deleteSrc*** is *true*, then ***srcFolder*** will be *deleted* after conversion (files inside ***srcFolder*** will also be deleted), else the files and ***srcFolder** remains untouched.
* If ***deleteSrc*** is *"onlyFiles"*, then only the files inside ***srcFolder*** will be deleted.

## *Constraints:*<br>
***HALG*** *(string)* can take values which can be found in ['sha1', 'sha256', 'sha512'].<br>
***ext*** *(string)* can take values which can be found in ['.json', '.txt', ""].<br>
***numOfChars*** is an *integer*.<br>
***deleteSrc*** is a *boolean* or a *string*.
<br><br>

# ***THANK YOU!***<br>

## For more info, visit [github repo](https://github.com/hrithikgautham/gitmon-npm).
