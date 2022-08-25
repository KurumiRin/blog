const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function getAstModules(name) {
  // 获取绝对路径
  name = path.resolve(__dirname, name);
  // 获取文件中的内容
  const code = fs.readFileSync(name, "utf8");
  // 通过babel的parse转化为AST树
  const ast = parse(code, {
    sourceType: "module",
  });
  // 依赖数组
  const deps = [];
  // 对AST进行操作
  traverse(ast, {
    enter({ node }) {
      // 这里可以通过上面的AST转化观察发现当type为CallExpression且callee的name为require时就是require操作
      if (node.type === "CallExpression" && node.callee.name === "require") {
        // 获取到这个被require的对象
        const argument = node.arguments[0];
        // 进行递归处理(深度优先)
        if (argument.type === "StringLiteral") {
          // 基于当前路径拼接获取目标文件的路径
          const nextName = path.join(
            path.dirname(name),
            argument.value
          );
          // 递归
          deps.push(getAstModules(nextName));
        }
      }
    },
  });
  // 最终生成依赖树
  return {
    name,
    deps,
  };
}

