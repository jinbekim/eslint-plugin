// eslint.config.js
'use strict';
const eslintPluginExample = require('./src/eslint-plugins');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
    },
    plugins: { example: eslintPluginExample },
    rules: {
      'example/no-forEach': 'error',
    },
  },
];
