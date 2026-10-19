// Shared plumbing for the build-time snapshot scripts.
//
// The portfolio is a static export with no Worker, so anything it shows from an external
// service has to be written into src/lib at build time. When a service is unreachable the
// committed snapshot is kept, so a network blip never breaks a deploy.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function syncSnapshot({ label, file, generate }) {
  const target = resolve(repoRoot, file);
  try {
    const { source, summary } = await generate();
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, source, 'utf8');
    console.log(`${label}: ${summary}`);
  } catch (error) {
    const exists = await readFile(target, 'utf8').then(() => true, () => false);
    if (exists) {
      console.warn(`${label}: sync failed (${error.message}); kept the committed snapshot.`);
      return;
    }
    console.error(`${label}: sync failed and no snapshot exists — ${error.message}`);
    process.exitCode = 1;
  }
}
