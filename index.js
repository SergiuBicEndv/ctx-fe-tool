#!/usr/bin/env node

// @ts-check
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import prompts from 'prompts'
import { blue, cyan, red, reset, yellow, green } from 'kolorist'

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
  let template = argv.template || argv.t
  let pkgManager = argv.pkgman
  console.log(argv)

  const defaultTargetDir = 'ctx-template-fe-react'
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
          type: 'text',
          name: 'framework',
          message: 'Framework:',
          initial: 'react-ts',
        },
        {
          type: 'multiselect',
          name: 'features',
          message: 'Pick the features that you want to include in your project',
          choices: [
            { title: 'Redux', value: 'redux' },
            { title: 'TailwindCSS', value: 'tailwind' },
            { title: 'React Router', value: 'router' },
            { title: 'E2E (Cypress)', value: 'cypress' }
          ],
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
  const { framework, overwrite, packageName, pkgman, features } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  // determine template and pkg manager
  const featureTemplate = features.join('-');
  template = featureTemplate || framework || template
  pkgManager = pkgman || pkgManager || SUPPORTED_PACKAGE_MANAGERS[0]

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    `ctx-template-fe-${template}`
  )

  const commonDir = path.resolve(fileURLToPath(import.meta.url), '..', `common`)

  const write = (file, content, isCommon) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(isCommon ? commonDir : templateDir, file), targetPath)
    }
  }

  const templateFiles = fs.readdirSync(templateDir)

  for (const file of templateFiles.filter((f) => f !== 'package.json')) {
    write(file)
  }

  //@TODO: the cli should be extracted as a dependency.
  const commonFiles = fs.readdirSync(commonDir).filter((f) => {
    let negativeVals = ['package.json']

    if (pkgManager !== 'yarn') {
      negativeVals.push('.yarnrc.yml', '.yarn')
    }

    return !negativeVals.includes(f)
  })

  for (const file of commonFiles) {
    const IS_COMMON = true
    write(file, undefined, IS_COMMON)
  }

  // Start pakage.json modify
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
  )

  // Common package.json contains all scripts and dependencies
  // that should be added by default in all templates
  const commonPkg = JSON.parse(
    fs.readFileSync(path.join(commonDir, `package.json`), 'utf-8')
  )

  pkg.name = packageName || getProjectName()
  pkg.devDependencies = { ...pkg.devDependencies, ...commonPkg.devDependencies }
  pkg.prettier = commonPkg.prettier
  pkg.xo = commonPkg.xo
  pkg.engines = commonPkg.engines
  pkg.scripts = {
    preinstall: `npx only-allow ${pkgManager}`,
    ...commonPkg.scripts
  }

  if (pkgManager === 'yarn') {
    pkg.engines = { ...pkg.engines, yarn: '>=3.2.1' }
  }

  write('package.json', JSON.stringify(pkg, null, 2))

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
