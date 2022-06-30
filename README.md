# create-vite

- This repo is forked after the vite/package/create-vite and then modified accordingly for a PoC

## Scaffolding Your First CTX/Vite Project

> **Compatibility Note:**
> Vite requires [Node.js](https://nodejs.org/en/) version >=14.6.0. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + React CTX project, run:

```bash
# npm 6.x
npx create-ctx-app test-ctx-app --template react

# npm 7+, extra double-dash is needed:
npx create-ctx-app test-ctx-app --template react-ts

# yarn
yarn create-ctx-app test-ctx-app --template react
```

Currently supported template presets include:

- `react`
- `react-ts`
- `react-ts-tailwind`

You can use `.` for the project name to scaffold in the current directory.

## Community Templates [ Original Forked ]

create-vite is a tool to quickly start a project from a basic template for popular frameworks. Check out Awesome Vite for [community maintained templates](https://github.com/vitejs/awesome-vite#templates) that include other tools or target different frameworks.
