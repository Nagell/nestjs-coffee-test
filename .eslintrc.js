module.exports = {

    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2021
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        /* 'plugin:prettier/recommended', */
    ],
    root: true,
    env: {
        node: true,
        jest: true,
        es2021: true
    },
    ignorePatterns: ['.eslintrc.js', '**/node_modules/*', '**/dist/*', '**/vendor/*'],

    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    rules: {
        /* RUNNING */
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        /* GENERAL */
        'indent': ['error', 4],
        semi: ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'max-len': ['warn',
            {
                'code': 120,
                'tabWidth': 4,
                'comments': 120,
                'ignorePattern': '',
                'ignoreComments': false,
                'ignoreTrailingComments': false,
                'ignoreUrls': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
                'ignoreRegExpLiterals': true
            }
        ],

        /* JS */
        'operator-linebreak': [2, 'before'], // for easier to read operator breaks
        'no-useless-escape': 'off',

        /* TS */
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
