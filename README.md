# StackSettings

CLI to generate VS Code workspace settings for new projects by selecting your tech stack from a terminal menu.

## What it does

Generates a `.vscode/settings.json` in your project with settings tuned for the selected stacks, merged on top of a sensible base config. It also updates `.gitignore` with stack-appropriate patterns.

The base config covers editor fundamentals: formatting, indentation, bracket colorization, file nesting, and Prettier as the default formatter. Each stack layer adds its specific settings on top.

## Usage

In the root of a new project:

```bash
npx github:iago-anjos/StackSettings
```

Select the stacks that apply (comma-separated numbers):

```
  VS Code Settings Generator

Selecione as stacks do projeto (numeros separados por virgula):

  1. React
  2. Next.js
  3. TypeScript
  4. Tailwind CSS
  5. Prisma / Postgres
  6. GraphQL / Apollo
  7. Express / Node
  8. VTEX IO
  9. Nuvemshop
  0. Nenhuma (somente base)

> 1,2,3

  .vscode/settings.json gerado com: React, Next.js, TypeScript
  .vscode/settings.json adicionado ao .gitignore
```

The settings file is gitignored by default — it is personal workspace config, not project config.

## Requirements

- Node.js 18+
- VS Code with the relevant extensions installed per stack (Prettier, ESLint, Tailwind CSS IntelliSense, Prisma, GraphQL, etc.)

## Structure

```
stacks/
  base.json        — base editor config (font, theme, formatting)
  react.json       — React + JSX settings and inlay hints
  nextjs.json      — Next.js specific (path aliases, watcher excludes)
  typescript.json  — full TypeScript inlay hints and preferences
  tailwind.json    — Tailwind CSS IntelliSense + class detection
  prisma.json      — Prisma formatter and file associations
  graphql.json     — GraphQL language support
  express.json     — Node.js debug auto-attach and build config
  vtex.json        — VTEX IO workspace config
  nuvemshop.json   — Twig template support and SCSS formatting

gitignore/
  base.txt         — common ignores (node_modules, .env, logs)
  react.txt        — build output, coverage, cache
  nextjs.txt       — .next, .turbo, .vercel
  typescript.txt   — dist, tsbuildinfo
  prisma.txt       — SQLite database files
  graphql.txt      — generated type files
  express.txt      — build output, uploads
  vtex.txt         — .vtex, store/react
```

## Customizing base.json

`base.json` is the personal baseline applied to every project. Edit it to match your global VS Code preferences (theme, font size, terminal profile, rulers, etc.). When you fork this repo, this is the main file to update to match your setup.

## Adding a new stack

1. Create `stacks/name.json` with the VS Code workspace settings for that stack:

```json
{
  "[dockerfile]": { "editor.defaultFormatter": "ms-azuretools.vscode-docker" }
}
```

2. Optionally create `gitignore/name.txt` with patterns to append to `.gitignore`.

3. Add the entry to the `STACKS` array in `init.js`:

```js
{ label: 'Docker', file: 'docker.json' },
```

## Using your own fork

Fork the repo, update `base.json` with your personal settings, and run:

```bash
npx github:your-username/StackSettings
```
