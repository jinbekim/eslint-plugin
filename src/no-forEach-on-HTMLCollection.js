/** @type {import('eslint').Linter.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using forEach on HTMLCollection',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidForEachOnHTMLCollection:
        'HTMLCollection does not support forEach. Convert it to an array using Array.from() or spread operator.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const htmlCollectionsGetters = [
      'getElementsByTagName',
      'getElementsByClassName',
      'getElementsByTagNameNS',
    ];

    const htmlCollections = new Set();

    return {
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'MemberExpression' &&
          node.init.callee.object.name === 'document' &&
          htmlCollectionsGetters.includes(node.init.callee.property.name)
        ) {
          htmlCollections.add(node.id.name);
        }
      },

      CallExpression(node) {
        const { callee } = node;
        const objectNode = callee.object;
        const objectName = node.callee.object?.name;

        if (
          objectNode.type === 'CallExpression' &&
          objectNode.callee.type === 'MemberExpression' &&
          htmlCollectionsGetters.includes(objectNode.callee.property.name) &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'forEach'
        ) {
          context.report({
            node,
            messageId: 'avoidForEachOnHTMLCollection',
            data: { name: objectNode.callee.property.name },
            fix(fixer) {
              return fixer.replaceText(
                node,
                `Array.from(${sourceCode.getText(objectNode)}).forEach`
              );
            },
          });
        }

        if (
          callee.type === 'MemberExpression' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'forEach' &&
          htmlCollections.has(objectName)
        ) {
          context.report({
            node,
            messageId: 'avoidForEachOnHTMLCollection',
            data: { name: objectName },
            fix(fixer) {
              return fixer.replaceText(node, `Array.from(${objectName}).forEach`);
            },
          });
        }
      },
    };
  },
};
