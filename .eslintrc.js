module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'script/*.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-new': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/array-type': 'off',
  },
}
