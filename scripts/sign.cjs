const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

module.exports = async function(context) {
  console.log('Debugging context properties:');
  console.log('context.path:', context.path);
  console.log('context.appOutDir:', context.appOutDir);
  console.log('context.electronPlatformName:', context.electronPlatformName);

  let artifactPath;
  const productName = "FluoGraphiX"; // From package.json

  switch (context.electronPlatformName) {
    case 'win32':
      artifactPath = `${context.appOutDir}\\${productName}.exe`;
      break;
    case 'darwin':
      artifactPath = `${context.appOutDir}/${productName}.app/Contents/MacOS/${productName}`;
      break;
    case 'linux':
      artifactPath = `${context.appOutDir}/${productName}`;
      break;
    default:
      console.log(`Unsupported platform: ${context.electronPlatformName}, skipping cosign signature.`);
      return;
  }

  console.log(`Constructed artifactPath: ${artifactPath}`);

  console.log(`Signing artifact with cosign: ${artifactPath}`);

  try {
    // Normalize path to POSIX format and add file:// prefix for cosign
    const normalizedPath = path.posix.normalize(artifactPath.replace(/\\/g, '/'));
    const cosignPath = `file://${normalizedPath}`;
    
    const { stdout, stderr } = await execAsync(`cosign sign --yes "${cosignPath}"`, { env: { ...process.env, COSIGN_EXPERIMENTAL: '1' } });
    console.log('Cosign signature successful:', stdout);
    if (stderr) {
      console.error('Cosign signature stderr:', stderr);
    }
  } catch (error) {
    console.error(`Failed to sign ${artifactPath} with cosign:`, error);
    throw error; // Fail the build if signing fails
  }
}