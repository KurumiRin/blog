import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

function removeConsole(code) {
  const ast = parse(code, {
    sourceType: 'module'
  })

  traverse(ast, {
    enter(path) {
      const { node } = path
      if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
        const callee = node.expression.callee
        // 判断是否为console.log
        if (callee.type === 'MemberExpression' && callee.object.name === 'console' && callee.property.name === 'log')
          // 删除该部分AST树
          path.remove()
      }
    },
  })
  // 生成去除玩console的新的代码
  return generate(ast).code
}