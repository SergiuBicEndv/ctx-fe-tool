import { join } from 'path'
import { ExecaSyncReturnValue, SyncOptions, execaCommandSync } from 'execa'
import { mkdirpSync, readdirSync, remove, writeFileSync } from 'fs-extra'
import { afterEach, beforeAll, expect, test } from 'vitest'

const CLI_PATH = join(__dirname, '..')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

const run = (
  args: string[],
  options: SyncOptions<string> = {}
): ExecaSyncReturnValue<string> => {
  return execaCommandSync(`node ${CLI_PATH} ${args.join(' ')}`, options)
}

// Helper to create a non-empty directory
const createNonEmptyDir = () => {
  // Create the temporary directory
  mkdirpSync(genPath)

  // Create a package.json file
  const pkgJson = join(genPath, 'package.json')
  writeFileSync(pkgJson, '{ "foo": "bar" }')
}

const templateFiles = readdirSync(join(CLI_PATH, 'ctx-template-fe-react-ts'))
  // _gitignore is renamed to .gitignore
  .map((filePath) => (filePath === '_gitignore' ? '.gitignore' : filePath))
  .sort()

beforeAll(() => remove(genPath))
afterEach(() => remove(genPath))

test('prompts for the project name if none supplied', () => {
  const { stdout, exitCode } = run([])
  expect(stdout).toContain('Project name:')
})

test('prompts for the framework if none supplied when target dir is current directory', () => {
  mkdirpSync(genPath)
  const { stdout } = run(['.'], { cwd: genPath })
  expect(stdout).toContain('Select a framework:')
})

test('prompts for the framework if none supplied', () => {
  const { stdout } = run([projectName])
  console.log(stdout)
  expect(stdout).toContain('Select a framework:')
})

test('prompts for the framework on not supplying a value for --template', () => {
  const { stdout } = run([projectName, '--template'])
  expect(stdout).toContain('Select a framework:')
})

test('prompts for the framework on supplying an invalid template', () => {
  const { stdout } = run([projectName, '--template', 'unknown'])
  expect(stdout).toContain(
    `"unknown" isn't a valid template. Please choose from below:`
  )
})

test('prompts for the framework on not supplying a value for --pkgman', () => {
  const { stdout } = run([projectName, '--template', 'react-ts', '--pkgman'])
  expect(stdout).toContain('Select a package manager:')
})

test('asks to overwrite non-empty target directory', () => {
  createNonEmptyDir()
  const { stdout } = run([projectName], { cwd: __dirname })
  expect(stdout).toContain(`Target directory "${projectName}" is not empty.`)
})

test('asks to overwrite non-empty current directory', () => {
  createNonEmptyDir()
  const { stdout } = run(['.'], { cwd: genPath })
  expect(stdout).toContain(`Current directory is not empty.`)
})

test('successfully scaffolds a project based on react-ts starter template with all arguments provided', () => {
  const { stdout } = run(
    [projectName, '--template', 'react-ts', '--pkgman', 'yarn'],
    {
      cwd: __dirname
    }
  )
  const generatedFiles = readdirSync(genPath).sort()

  // Assertions
  expect(stdout).toContain(`Scaffolding project in ${genPath}`)
  expect(generatedFiles).toContain('.yarn')
  expect(generatedFiles).toContain('.yarnrc.yml')
})
