import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const target = resolve(packageRoot, 'openapi/api-docs.json');

const backendCandidates = [
  resolve(packageRoot, '../../event-platform/storage/api-docs/api-docs.json'),
  resolve(packageRoot, '../../../event-platform/storage/api-docs/api-docs.json'),
];

const source = backendCandidates.find((candidate) => existsSync(candidate));

if (!source) {
  if (!existsSync(target)) {
    console.error('OpenAPI spec not found. Commit openapi/api-docs.json or clone the backend repo.');
    process.exit(1);
  }

  console.log('Using committed openapi/api-docs.json (backend source not found).');
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`Synced OpenAPI spec from ${source}`);
