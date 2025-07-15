import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function(context) {
  const { appOutDir, electronPlatformName } = context;
  const artifactPath = context.artifactPaths[0];

  if (!artifactPath) {
    console.log('No artifact path found, skipping signature.');
    return;
  }

  console.log(`Signing artifact: ${artifactPath}`);

  try {
    const { stdout, stderr } = await execAsync(`cosign sign --yes "${artifactPath}"`, { env: { ...process.env, COSIGN_EXPERIMENTAL: '1' } });
    console.log('Signature successful:', stdout);
    if (stderr) {
      console.error('Signature stderr:', stderr);
    }
  } catch (error) {
    console.error(`Failed to sign ${artifactPath}:`, error);
    throw error; // Fail the build if signing fails
  }
}
