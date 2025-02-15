// eslint.config.js
'use strict';
const eslintPluginExample = require('./src');

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
