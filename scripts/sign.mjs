import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function(context) {
  const { appOutDir, electronPlatformName } = context;
  const artifactPath = context.path;

  if (!artifactPath) {
    console.log('No artifact path found in context.path, skipping cosign signature.');
    throw new Error('Artifact path is required for signing.');
  }

  console.log(`Signing artifact with cosign: ${artifactPath}`);

  try {
    const { stdout, stderr } = await execAsync(`cosign sign --yes "${artifactPath}"`, { env: { ...process.env, COSIGN_EXPERIMENTAL: '1' } });
    console.log('Cosign signature successful:', stdout);
    if (stderr) {
      console.error('Cosign signature stderr:', stderr);
    }
  } catch (error) {
    console.error(`Failed to sign ${artifactPath} with cosign:`, error);
    throw error; // Fail the build if signing fails
  }
}