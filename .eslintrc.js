module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
