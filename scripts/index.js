const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { parse: parseVue } = require('@vue/compiler-sfc');
const espree = require('espree');
const estraverse = require('estraverse');

const targetDir = process.argv[2] || 'src'; // 검사할 대상 디렉토리

function extractScriptFromVue(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseVue(content);

  if (parsed.descriptor.script) {
    return parsed.descriptor.script.content; // <script> 내용 추출
  }
  if (parsed.descriptor.scriptSetup) {
    return parsed.descriptor.scriptSetup.content; // <script setup> 내용 추출
  }
  return null;
}

function checkForEachOnHTMLCollection(filePath, code) {
  try {
    // Parse the code into an AST
    const ast = espree.parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      loc: true,
    });
    const htmlCollections = new Set();

    // Traverse the AST to find `forEach` calls on `HtmlCollection`
    estraverse.traverse(ast, {
      enter(node, parent) {
        // Track variables assigned an `HtmlCollection`
        if (
          node.type === 'VariableDeclarator' &&
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'MemberExpression' &&
          node.init.callee.object.name === 'document' &&
          ['getElementsByClassName', 'getElementsByTagName', 'getElementsByTagNameNS'].includes(
            node.init.callee.property.name
          )
        ) {
          htmlCollections.add(node.id.name);
        }

        // check for `forEach()` calls on directly accessed `HtmlCollection` getters
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'CallExpression' &&
          node.callee.object.callee.type === 'MemberExpression' &&
          node.callee.object.callee.object.name === 'document' &&
          ['getElementsByClassName', 'getElementsByTagName', 'getElementsByTagNameNS'].includes(
            node.callee.object.callee.property.name
          ) &&
          node.callee.property.name === 'forEach'
        ) {
          console.error(
            `⚠️  ${filePath}:${node.loc?.start.line} - Avoid using forEach on HTMLCollection`
          );
        }

        // Check for `forEach()` calls on tracked `HtmlCollection` variables
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'forEach' &&
          node.callee.object.type === 'Identifier' &&
          htmlCollections.has(node.callee.object.name)
        ) {
          console.error(
            `⚠️  ${filePath}:${node.loc?.start.line} - Avoid using forEach on HTMLCollection`
          );
        }
      },
    });
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error.message);
  }
}

function scanDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      const code = fs.readFileSync(filePath, 'utf-8');
      checkForEachOnHTMLCollection(filePath, code);
    } else if (filePath.endsWith('.vue')) {
      const scriptCode = extractScriptFromVue(filePath);
      if (scriptCode) {
        checkForEachOnHTMLCollection(filePath, scriptCode);
      }
    }
  });
}
// 검사 실행
console.log(`🔍 Scanning directory: ${targetDir}`);
scanDirectory(targetDir);
console.log('✅ Scan complete.');
