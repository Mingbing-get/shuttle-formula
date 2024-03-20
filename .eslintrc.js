module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'standard-with-typescript',
    'prettier',
  ],
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
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'script/*.js'],
  rules: {
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/array-type': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
}
