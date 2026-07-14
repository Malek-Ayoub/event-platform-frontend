import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const sourceSpec = resolve(packageRoot, 'openapi/api-docs.json');
const generatedDir = resolve(packageRoot, 'src/core/generated');
const filteredDir = resolve(packageRoot, 'openapi/filtered');

const spec = JSON.parse(readFileSync(sourceSpec, 'utf8'));

function classifyPath(path) {
  if (path.startsWith('/api/admin')) {
    return 'admin';
  }

  if (path.startsWith('/api/tenant')) {
    return 'tenant';
  }

  return 'public';
}

function collectTags(paths, targetPaths) {
  const tags = new Set();

  for (const path of targetPaths) {
    const methods = paths[path] ?? {};

    for (const operation of Object.values(methods)) {
      if (operation && typeof operation === 'object' && Array.isArray(operation.tags)) {
        for (const tag of operation.tags) {
          tags.add(tag);
        }
      }
    }
  }

  return tags;
}

function splitSpec() {
  const buckets = {
    public: {},
    tenant: {},
    admin: {},
  };

  for (const [path, definition] of Object.entries(spec.paths ?? {})) {
    buckets[classifyPath(path)][path] = definition;
  }

  mkdirSync(filteredDir, { recursive: true });

  const filteredSpecs = {};

  for (const [name, paths] of Object.entries(buckets)) {
    const tags = collectTags(spec.paths ?? {}, Object.keys(paths));
    filteredSpecs[name] = {
      ...spec,
      paths,
      tags: (spec.tags ?? []).filter((tag) => tags.has(tag.name)),
    };

    writeFileSync(
      resolve(filteredDir, `${name}.json`),
      `${JSON.stringify(filteredSpecs[name], null, 2)}\n`,
    );
  }

  return filteredSpecs;
}

function writeClientStub(name) {
  writeFileSync(
    resolve(generatedDir, `${name}-client.ts`),
    `/** Generated stub — HTTP clients are created via create${capitalize(name)}Client() in core/client. */\nexport type ${capitalize(name)}ApiClientName = '${name}';\n`,
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

splitSpec();
mkdirSync(generatedDir, { recursive: true });

for (const name of ['public', 'tenant', 'admin']) {
  const input = resolve(filteredDir, `${name}.json`);
  const output = resolve(generatedDir, `${name}-types.ts`);

  execFileSync(
    `pnpm exec openapi-typescript "${input}" -o "${output}"`,
    {
      cwd: packageRoot,
      stdio: 'inherit',
      shell: true,
    },
  );

  writeClientStub(name);
}

console.log('Generated OpenAPI types for public, tenant, and admin clients.');
