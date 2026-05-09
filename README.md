# claude-settings

CLI para gerar `.claude/settings.json` por stack de projeto.

## Uso

Na raiz de qualquer projeto novo:

```bash
npx github:seu-usuario/claude-settings
```

O terminal vai perguntar quais stacks o projeto usa:

```
  Claude Settings Generator

Selecione as stacks do projeto (numeros separados por virgula):

  1. React
  2. Next.js
  3. TypeScript
  4. Tailwind CSS
  5. Prisma / Postgres
  6. GraphQL / Apollo
  7. VTEX IO
  8. Nuvemshop
  0. Nenhuma (somente base)

> 1,2,3,4

  .claude/settings.json gerado com: React, Next.js, TypeScript, Tailwind CSS
  .claude/settings.local.json adicionado ao .gitignore
```

## Como funciona

- `stacks/base.json` — permissões que sempre se aplicam (git, npm, npx, node, WebSearch, GitHub)
- Cada stack adiciona apenas o que é específico dela
- As permissões são mergeadas e deduplicadas automaticamente
- O `settings.local.json` é adicionado ao `.gitignore` para overrides pessoais

## Adicionando uma nova stack

Crie um arquivo em `stacks/` com as permissões adicionais:

```json
{
  "permissions": {
    "allow": [
      "Bash(docker *)",
      "WebFetch(domain:docs.docker.com)"
    ]
  }
}
```

E adicione a entrada no array `STACKS` dentro de `init.js`.

## Camadas de settings

```
~/.claude/settings.json       ← global (suas preferencias pessoais)
     +
.claude/settings.json         ← projeto (commitado no git)  ← gerado por este CLI
     +
.claude/settings.local.json   ← projeto pessoal (no .gitignore)
```
