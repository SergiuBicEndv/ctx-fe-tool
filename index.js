#!/usr/bin/env node

// @ts-check
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import prompts from 'prompts'
import { red, reset } from 'kolorist'
import nodePlop from 'node-plop'

const plop = await nodePlop(
  path.resolve(fileURLToPath(import.meta.url), '..', `plopfile.cjs`)
)

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist(process.argv.slice(2), { string: ['_'] })

const cwd = process.cwd()

// @TODO: Add support to get pkg manager info from env, (npx, yarn dlx, pnpm create)
// const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
// const pkgManager = pkgInfo ? pkgInfo.name : 'yarn'

const SUPPORTED_PACKAGE_MANAGERS = ['yarn', 'pnpm', 'npm']

const renameFiles = {
  _gitignore: '.gitignore'
}

async function init() {
  let targetDir = formatTargetDir(argv._[0])
  let plugins = argv.plugins || argv.t
  let pkgManager = argv.pkgman

  const defaultTargetDir = 'base-template'
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result = {}

  try {
    result = await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          }
        },
        {
          // @ts-ignore
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`
        },
        {
          // @ts-ignore
          type: (_, { overwrite }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker'
        },
        {
          // @ts-ignore
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          // @ts-ignore
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          type: 'multiselect',
          name: 'features',
          message: 'Pick the features that you want to include in your project',
          choices: [
            { title: 'Authentification (AWS Cognito)', value: 'auth' },
            { title: 'Redux', value: 'redux' },
            { title: 'TailwindCSS', value: 'tailwind' },
            { title: 'React Router', value: 'router' },
            { title: 'E2E (Cypress)', value: 'cypress' }
          ],
          hint: `\nTip: Press Enter to scaffold base template only...\n`
        },
        {
          type:
            pkgManager && SUPPORTED_PACKAGE_MANAGERS.includes(pkgManager)
              ? null
              : 'select',
          name: 'pkgman',
          message: reset('Select a package manager:'),
          // @ts-ignore
          choices: () =>
            SUPPORTED_PACKAGE_MANAGERS.map((pkg) => ({
              title: `${pkg} ${pkg === 'yarn' ? '(Recommended)' : ''}`,
              value: pkg
            }))
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const { overwrite, packageName, pkgman, features } = result

  //root = where the files are written
  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  //0. Determine the base template
  const baseDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    'base-template'
  )
  //@TODO: the generator should be extracted as a dependency.
  const getCommonFiles = () => {
    const files = fs.readdirSync(baseDir).filter((f) => {
      const negativeVals = ['package.json']

      if (pkgManager !== 'yarn' && pkgman !== 'yarn') {
        negativeVals.push('.yarnrc.yml', '.yarn')
      }

      return !negativeVals.includes(f)
    })

    return files
  }

  const write = (dir, file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(dir, file), targetPath)
    }
  }

  const commonFiles = getCommonFiles()

  for (const file of commonFiles) {
    write(baseDir, file)
  }

  // determine template and pkg manager
  plugins = features || plugins || []
  pkgManager = pkgman || pkgManager || SUPPORTED_PACKAGE_MANAGERS[0]

  console.log(`\nScaffolding project in ${root}...`)

  // used to dynamically check for different plugins
  const getPluginDir = (plugin) =>
    path.resolve(fileURLToPath(import.meta.url), '..', `plugin-${plugin}`)

  const pkg = {}

  //2. copy plugins files
  if (['router', 'auth'].every((value) => features.includes(value)))
    plugins = plugins.filter((plugin) => plugin !== 'router')

  for (const plugin of plugins) {
    const pluginPath = getPluginDir(plugin)
    const pluginFiles = fs.readdirSync(pluginPath)

    for (const file of pluginFiles.filter((f) => f !== 'package.json')) {
      write(pluginPath, file)
    }

    const packagePath = path.join(getPluginDir(plugin), `package.json`)
    let temp = {}
    if (fs.existsSync(packagePath)) {
      temp = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    }
    pkg.dependencies = { ...pkg.dependencies, ...temp.dependencies }
    pkg.devDependencies = { ...pkg.devDependencies, ...temp.devDependencies }
  }

  if (
    plugins.length > 0 &&
    (plugins.includes('redux') || plugins.includes('router'))
  ) {
    if (features.includes('tailwind'))
      plugins = plugins.filter((plugin) => plugin !== 'tailwind')
    if (features.includes('router') && !plugins.includes('router'))
      plugins = [...plugins, 'router']

    // We can use this pattern if we need to inject code in our template files.
    plop
      .getGenerator('providers')
      .runActions({ providers: plugins, targetDir: root })
  }

  // Common package.json contains all scripts and dependencies
  // that should be added by default in all templates
  const commonPkg = JSON.parse(
    fs.readFileSync(path.join(baseDir, `package.json`), 'utf-8')
  )

  pkg.name = packageName || getProjectName()
  pkg.dependencies = { ...pkg.dependencies, ...commonPkg.dependencies }
  pkg.devDependencies = { ...pkg.devDependencies, ...commonPkg.devDependencies }
  pkg.prettier = commonPkg.prettier
  pkg.xo = commonPkg.xo
  pkg.engines = commonPkg.engines
  pkg.scripts = {
    preinstall: `npx only-allow ${pkgManager}`,
    ...commonPkg.scripts
  }

  if (pkgManager === 'yarn') {
    pkg.scripts = {
      postinstall: 'yarn dlx @yarnpkg/sdks vscode',
      ...pkg.scripts
    }
    pkg.engines = { ...pkg.engines, yarn: '>=3.2.3' }
  }

  write(baseDir, 'package.json', JSON.stringify(pkg, null, 2))

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  console.log(`  ${pkgManager} install`)
  console.log(`  ${pkgManager} run dev`)
  console.log()
}

/**
 * @param {string | undefined} targetDir
 */
function formatTargetDir(targetDir) {
  if (targetDir === undefined) return ''

  return targetDir?.trim().replace(/\/+$/g, '')
}

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

/**
 * @param {string} projectName
 */
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

/**
 * @param {string} projectName
 */
function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 */
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

/**
 * @param {string} path
 */
function isEmpty(path) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

/**
 * @param {string} dir
 */
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

/**
 * @param {string | undefined} userAgent process.env.npm_config_user_agent
 * @returns object | undefined
 */
// @ts-ignore
function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

init().catch((e) => {
  console.error(e)
})
