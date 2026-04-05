import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
	// Base JS rules
	js.configs.recommended,

	// TypeScript rules
	...tseslint.configs.recommended,

	// Global project rules
	{
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'error',

			// project-wide standards
			'no-console': 'error',

			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},

	// Files to ignore
	{
		ignores: ['src/types/supabase.ts'],
	},

	// Test-specific overrides
	{
		files: ['src/tests/**/*.{ts,tsx}'],
		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
