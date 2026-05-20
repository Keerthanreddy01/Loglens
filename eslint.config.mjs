import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const eslintConfig = [
    // Ignore build outputs and generated files
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'out/**',
            'dist/**',
            'public/**',
        ],
    },

    // Core + TypeScript + Next.js rules via FlatCompat
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
        'prettier'
    ),

    // Custom rule overrides
    {
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/no-empty-object-type': 'warn',
        },
    },
];

export default eslintConfig;
