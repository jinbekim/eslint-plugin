/** @type {import('eslint').Linter.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using forEach on HTMLCollection',
      category: 'Possible Errors',
      recommended: true,
    },
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
    function findVariableInScope(scope, name) {
      while (scope) {
        const variable = scope.set.get(name);
        if (variable) return variable;
        scope = scope.upper; // 상위 스코프로 이동
      }
      return null;
    }
    return {
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
          context.report({ node, messageId: 'avoidForEachOnHTMLCollection' });
        }

        if (
          callee.type === 'MemberExpression' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'forEach'
        ) {
          if (!objectName) return;
          const scope = sourceCode.getScope(objectNode);
          const variable = findVariableInScope(scope, objectName);

          if (variable) {
            variable.defs.forEach((def) => {
              if (
                def.node.init &&
                def.node.init.type === 'CallExpression' &&
                def.node.init.callee.type === 'MemberExpression' &&
                htmlCollectionsGetters.includes(def.node.init.callee.property.name)
              ) {
                context.report({ node, messageId: 'avoidForEachOnHTMLCollection' });
              }
            });
          }
        }
      },
    };
  },
};
