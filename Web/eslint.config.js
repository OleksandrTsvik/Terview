import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      quotes: ['warn', 'single'],
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'object', 'type', 'unknown'],
          pathGroups: [
            {
              patternOptions: {
                dot: true,
                nocomment: true,
                matchBase: true,
              },
              pattern: '*.{css,scss}',
              group: 'type',
              position: 'after',
            },
            {
              patternOptions: {
                dot: true,
                nocomment: true,
                matchBase: true,
              },
              pattern: '*.{svg,png,jpg}',
              group: 'type',
              position: 'after',
            },
          ],
          warnOnUnassignedImports: true,
          pathGroupsExcludedImportTypes: [],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
);
