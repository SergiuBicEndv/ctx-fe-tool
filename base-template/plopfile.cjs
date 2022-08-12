// @TODO: This should be migrated to a separate dependency
module.exports = plop => {
	plop.setGenerator('component', {
		description: 'Create a reusable component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter component name (Ex: MyComponent)',
			},
		],
		actions: [
			{
				type: 'add',
				// Plop will create directories for us if they do not exist
				// so it's okay to add files in nested locations.
				path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.tsx',
				templateFile: 'cli/templates/components/component.js.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.test.tsx',
				templateFile: 'cli/templates/components/component.test.js.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.module.scss',
				templateFile: 'cli/templates/components/component.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/components/index.ts',
				templateFile: 'cli/templates/components/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'add',
				path: 'src/components/{{kebabCase name}}/index.ts',
				templateFile: 'cli/templates/components/index.js.hbs',
			},
			{
				// Action type 'append' injects a template into an existing file
				type: 'append',
				path: 'src/components/index.ts',
				// Pattern tells plop where in the file to inject the template
				pattern: `/* CLI_INJECT_IMPORT */`,
				template: `import {{pascalCase name}} from './{{kebabCase name}}';`,
			},
			{
				type: 'append',
				path: 'src/components/index.ts',
				pattern: `/* CLI_INJECT_EXPORT */`,
				template: `{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator('hook', {
		description: 'Create a custom react hook',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter hook name? (Ex: useMyHook)',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/hooks/{{kebabCase name}}.tsx',
				templateFile: 'cli/templates/hooks/hook.js.hbs',
			},
			{
				type: 'add',
				path: 'src/hooks/index.ts',
				templateFile: 'cli/templates/hooks/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'src/hooks/index.ts',
				pattern: `/* CLI_INJECT_IMPORT */`,
				template: `import {{kebabCase name}} from './{{kebabCase name}}';`,
			},
			{
				type: 'append',
				path: 'src/hooks/index.ts',
				pattern: `/* CLI_INJECT_EXPORT */`,
				template: `{{kebabCase name}},`,
			},
		],
	});
};
