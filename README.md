# A App template

This is the CTX App template based on [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

## Prerequisites

- `node` 14.15.0 or higher.
- `npm` or `yarn` 1.22 or higher.
- Github personal access token. (Needed to install adi-ctx dependencies.)

## Getting started

Before installing the dependencies, you need to create a global environment variable with the key `GITHUB_PERSONAL_ACCESS_TOKEN`. It's value should be the generated personal access token from Github. For more information on how to generate this token refer to <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"> Creating a personal access token on Github. </a>

Once the env var is defined, install the project's depenencies:

```
yarn install
```

To start the dev server:

```
yarn dev
```

## IDE CONFIGURATION

The templates use Yarn 3 with PnP enabled, and is configured and optimized to be used with VSCODE. If you are using a different IDE, you may need to do some manual configuration, specially for Yarn PnP to work smoothly. If you are having issues with types and dependencies not being recognized, please refer to https://yarnpkg.com/getting-started/editor-sdks to setup your editor correctly.

Note: For safety reason VSCode requires you to explicitly activate the custom TS settings. A prompt should be displayed to allow the use of the workspace version of typescript. If the prompt is not displayed, you can enable it by following this steps:

```
ctrl+shift+p >> "Select Typescript Version" >> "Use Workspace Version"
```
