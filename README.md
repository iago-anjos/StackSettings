# StackSettings

CLI para configurar o Claude Code em projetos novos de acordo com as tecnologias que o projeto usa.

## Para que serve

O Claude Code usa um arquivo `.claude/settings.json` dentro de cada projeto para saber quais comandos e recursos ele tem permissao de usar. Sem esse arquivo, ele pede confirmacao para quase tudo ou fica restrito demais.

Este CLI gera esse arquivo automaticamente com base nas stacks que voce escolhe, sem precisar editar JSON na mao.

## Quando usar

Sempre que iniciar um projeto novo. Rode antes de comecar a trabalhar com o Claude Code no projeto.

## Como usar

Na raiz do projeto novo:

```bash
npx github:iago-anjos/StackSettings
```

O terminal exibe um menu com as stacks disponiveis:

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

> 1,2,3

  .claude/settings.json gerado com: React, Next.js, TypeScript
  .claude/settings.local.json adicionado ao .gitignore
```

O arquivo `.claude/settings.json` gerado pode ser commitado no repositorio do projeto.

## Como funciona

O settings global do Claude Code (`~/.claude/settings.json`) ja cobre as permissoes gerais como git, npm e ferramentas do dia a dia. O arquivo gerado por este CLI adiciona apenas o que e especifico daquele projeto, como dominios de documentacao, comandos de CLI de plataformas e ferramentas de banco de dados.

As permissoes das stacks selecionadas sao mergeadas e deduplicadas automaticamente com uma base comum (git, npm, npx, node, WebSearch, GitHub).

## Adicionando uma nova stack

1. Crie `stacks/nome.json` com as permissoes da stack:

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

2. Adicione a entrada no array `STACKS` dentro de `init.js`:

```js
{ label: 'Docker', file: 'docker.json' },
```
