const {exec} = require('child_process');
const {promisify} = require('util');
const execAsync = promisify(exec);
module.exports = async function (context) {
    console.log('Debugging context properties:');
    console.log('context.path:', context.path);
    console.log('context.appOutDir:', context.appOutDir);
    console.log('context.electronPlatformName:', context.electronPlatformName);
    let artifactPath;
    const productName = "FluoGraphiX";
}