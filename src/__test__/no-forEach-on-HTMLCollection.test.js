const { RuleTester } = require('eslint');
const rule = require('../no-forEach-on-HTMLCollection');

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2021 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  'no-forEach', // rule name
  rule, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: `const lists = document.getElementsByName('example');{lists?.forEach(console.log);}`,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: `document.getElementsByClassName('example')?.forEach(console.log);`,
        errors: [{ messageId: 'avoidForEachOnHTMLCollection' }],
      },
      {
        code: `const lists = document.getElementsByClassName('example'); lists?.forEach(console.log);`,
        errors: [{ messageId: 'avoidForEachOnHTMLCollection' }],
      },
    ],
  }
);

console.log('All tests passed!');
