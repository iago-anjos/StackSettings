#!/usr/bin/env node

import { createInterface } from 'readline';
import { writeFileSync, existsSync, mkdirSync, readFileSync, appendFileSync } from 'fs';
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
  { label: 'Express / Node',    file: 'express.json' },
  { label: 'VTEX IO',           file: 'vtex.json' },
  { label: 'Nuvemshop',         file: 'nuvemshop.json' },
];

function loadStack(filename) {
  return JSON.parse(readFileSync(join(__dirname, 'stacks', filename), 'utf8'));
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], val);
    } else if (Array.isArray(val) && Array.isArray(result[key])) {
      result[key] = [...result[key], ...val.filter(v => !result[key].includes(v))];
    } else {
      result[key] = val;
    }
  }
  return result;
}

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function ensureGitignore(cwd) {
  const gitignorePath = join(cwd, '.gitignore');
  const entry = '.vscode/settings.json';
  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf8');
    if (!content.includes(entry)) appendFileSync(gitignorePath, `\n${entry}\n`);
  } else {
    writeFileSync(gitignorePath, `${entry}\n`);
  }
}

async function main() {
  console.log('\n  VS Code Settings Generator\n');
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
  const merged = selected.reduce((acc, s) => deepMerge(acc, loadStack(s.file)), base);

  const cwd = process.cwd();
  const vscodeDir = join(cwd, '.vscode');
  if (!existsSync(vscodeDir)) mkdirSync(vscodeDir);
  writeFileSync(join(vscodeDir, 'settings.json'), JSON.stringify(merged, null, 2) + '\n');
  ensureGitignore(cwd);

  const labels = selected.length ? selected.map(s => s.label).join(', ') : 'base';
  console.log(`\n  .vscode/settings.json gerado com: ${labels}`);
  console.log(`  .vscode/settings.json adicionado ao .gitignore\n`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
