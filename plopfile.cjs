module.exports = (/** @type {import('node-plop').NodePlopAPI} */ plop) => {
  function formatString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  plop.setGenerator('providers', {
    prompts: [],
    actions: function (data) {
      const td = `${(data && data.targetDir) || ''}/src/utils/providers.ts`

      return [
        {
          type: 'modify',
          path: td,
          transform: (template, data) => {
            return new Promise((resolve, reject) => {
              const { providers } = data

              if (!providers) return resolve('')

              const components = providers.map(
                (plugin) => `${formatString(plugin)}Provider`
              )
              const imports = providers.map(
                (plugin, index) =>
                  `import ${components[index]} from '../components/providers/${plugin}-provider';`
              )
              const importString = imports.join('\n')
              const exportString = `\nexport const providers = [\n\t${components.join(
                ',\n\t'
              )}\n]\n`

              resolve(importString.concat('\n', exportString))
            })
          }
        }
      ]
    }
  })
}
