const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

module.exports = async function(context) {
  console.log('Debugging context properties:');
  console.log('context.path:', context.path);
  console.log('context.appOutDir:', context.appOutDir);
  console.log('context.electronPlatformName:', context.electronPlatformName);

  const artifactPath = context.path; // Utilise directement le chemin fourni par Electron Builder

  console.log(`Constructed artifactPath: ${artifactPath}`);

  console.log(`Signing artifact with cosign: ${artifactPath}`);

  try {
    const signaturePath = `${artifactPath}.sig`;

    const { stdout, stderr } = await execAsync(`cosign sign-blob --yes --output-signature "${signaturePath}" "${artifactPath}"`, { env: { ...process.env, COSIGN_EXPERIMENTAL: '1' } });
    console.log('Cosign signature successful:', stdout);
    if (stderr) {
      console.error('Cosign signature stderr:', stderr);
    }
  } catch (error) {
    console.error(`Failed to sign ${artifactPath} with cosign:`, error);
    throw error; // Fail the build if signing fails
  }
}