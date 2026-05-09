#!/usr/bin/env node

import { createInterface } from 'readline';
import { writeFileSync, existsSync, readFileSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STACKS = [
  { label: 'React',             file: 'react.json' },
  { label: 'Next.js',           file: 'nextjs.json' },
  { label: 'TypeScript',        file: 'typescript.json' },
  { label: 'Tailwind CSS',      file: 'tailwind.json' },
  { label: 'Prisma / Postgres', file: 'prisma.json' },
  { label: 'GraphQL / Apollo',  file: 'graphql.json' },
  { label: 'VTEX IO',           file: 'vtex.json' },
  { label: 'Nuvemshop',         file: 'nuvemshop.json' },
];

function loadStack(filename) {
  return JSON.parse(readFileSync(join(__dirname, 'stacks', filename), 'utf8'));
}

function merge(...configs) {
  const result = { permissions: { allow: [] } };
  for (const config of configs) {
    if (config.permissions?.allow) {
      result.permissions.allow.push(...config.permissions.allow);
    }
    for (const [key, val] of Object.entries(config)) {
      if (key === 'permissions') continue;
      result[key] = val;
    }
  }
  result.permissions.allow = [...new Set(result.permissions.allow)];
  return result;
}

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function ensureGitignore(cwd) {
  const gitignorePath = join(cwd, '.gitignore');
  const entry = 'settings.json';
  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf8');
    if (!content.includes(entry)) {
      appendFileSync(gitignorePath, `\n${entry}\n`);
    }
  } else {
    writeFileSync(gitignorePath, `${entry}\n`);
  }
}

async function main() {
  console.log('\n  Claude Settings Generator\n');
  console.log('Selecione as stacks do projeto (numeros separados por virgula):\n');
  STACKS.forEach((s, i) => console.log(`  ${i + 1}. ${s.label}`));
  console.log('  0. Nenhuma (somente base)\n');

  const answer = await ask('> ');

  let selected = [];
  if (answer !== '0' && answer !== '') {
    const indices = answer
      .split(',')
      .map(n => parseInt(n.trim()) - 1)
      .filter(n => n >= 0 && n < STACKS.length);

    if (!indices.length) {
      console.log('\nNenhuma stack valida selecionada. Saindo.');
      process.exit(1);
    }
    selected = indices.map(i => STACKS[i]);
  }

  const base = loadStack('base.json');
  const merged = merge(base, ...selected.map(s => loadStack(s.file)));
  merged['$schema'] = 'https://json.schemastore.org/claude-code-settings.json';

  const cwd = process.cwd();
  writeFileSync(join(cwd, 'settings.json'), JSON.stringify(merged, null, 2) + '\n');
  ensureGitignore(cwd);

  const labels = selected.length ? selected.map(s => s.label).join(', ') : 'base';
  console.log(`\n  settings.json gerado com: ${labels}`);
  console.log(`  settings.json adicionado ao .gitignore\n`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
