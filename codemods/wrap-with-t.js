/**
 * A jscodeshift transform that finds plain string literals
 * and replaces them with t('…') calls.
 */
export default function transformer(file, { jscodeshift: j }) {
    const root = j(file.source);
  
    // 1) Find all string literals in JSX and JS code
    root
      .find(j.Literal, path => {
        const val = path.node.value;
        return (
          typeof val === 'string' &&
          val.trim().length > 0 &&
          // skip imports, require() calls, JSX pragmas, etc.
          path.parentPath.value.type !== 'ImportDeclaration' &&
          path.parentPath.value.type !== 'JSXAttribute'
        );
      })
      // 2) Replace "Some text" → t("Some text")
      .forEach(path => {
        const text = path.node.value;
        path.replace(
          j.callExpression(j.identifier('t'), [j.stringLiteral(text)])
        );
      });
  
    return root.toSource({ quote: 'single' });
  }
  