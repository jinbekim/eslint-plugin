# no-forEach-on-HTMLCollection

## HTMLCollection is array-like object not array

```js
[
  'getElementsByTagName',
  'getElementsByClassName',
  'getElementsByTagNameNS',
]
```

을 통해 반환되는 [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)은 `Iterable` 하지 않은 유사배열객체이다. 때문에 `forEach`같은 메소드가 제공되지 않는다. 하지만 [core-js](https://github.com/zloirock/core-js?tab=readme-ov-file#iterable-dom-collections)에서는 해당 폴리필을 제공해 주고 있다.

>An HTMLCollection in the HTML DOM is live; it is automatically updated when the underlying document is changed. For this reason it is a good idea to make a copy (e.g., using Array.from) to iterate over if adding, moving, or removing nodes.

MDN에 설명에 따르면 `HTMLCollection`의 경우 `document`가 변경될때마다 자동으로 변경되기 때문에 copy를 만들어서 사용하는 것이 올바른 사용방법이다.

## Usage

해당 레포지토리는 1. eslint-plugin 과 2. script 두 가지를 포함하고 있습니다.

### eslint-plugin

플러그인을 추가하시고 룰을 추가하시면 됩니다.

```js
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
      'example/no-forEach-on-HTMLCollection': 'error',
    },
  },
];
```

### script

원하는 디렉토리의 경로를 인자로 전달해 주면 됩니다.

```sh
$> node ./scripts/index.js <targetDir>
```

## 예시

### eslint-plugin

![alt text](/images/image-1.png)

### script

![alt text](/images/image-2.png)
