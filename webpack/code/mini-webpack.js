const fs = require('fs')
const path = require('path')

// 负责 code -> ast
const { parse } = require('@babel/parser')
// 负责 ast -> ast
const traverse = require('@babel/traverse').default
// 负责 ast -> code
const generate = require('@babel/generator').default

let moduleId = 0
function buildModule(filename) {
  // 根据相对路径生成绝对路径
  filename = path.resolve(__dirname, filename)
  // 读取代码内容
  const code = fs.readFileSync(filename, 'utf8')
  // 解析为AST
  const ast = parse(code, {
    sourceType: 'module'
  })
  const deps = []
  const currentModuleId = moduleId

  traverse(ast, {
    enter({ node }) {
      // 根据 AST 定位到所有的 require 函数，寻找出所有的依赖
      if (node.type === 'CallExpression' && node.callee.name === 'require') {
        const argument = node.arguments[0]
        if (argument.type === 'StringLiteral') {
          moduleId++;
          const nextFilename = path.join(path.dirname(filename), argument.value)
          argument.value = moduleId
          deps.push(buildModule(nextFilename))
        }
      }
    }
  })
  return {
    filename,
    deps,
    code: generate(ast).code,
    id: currentModuleId
  }
}
// 将依赖模块转为数组结构
function moduleTreeToQueue(moduleTree) {
  const { deps, ...module } = moduleTree
  const moduleQueue = deps.reduce((acc, m) => {
    return acc.concat(moduleTreeToQueue(m))
  }, [module])
  return moduleQueue
}

// code部分在webpack会用loader进行处理
function createModuleWrapper(code) {
  return `
  (function(module, exports, require) {
    ${code}
  })`
}

// mini-webpack入口函数
function createBundleTemplate(entry) {
  const moduleTree = buildModule(entry)
  // 存储所有的依赖模块
  const modules = moduleTreeToQueue(moduleTree)
  // 生成打包的模板，也就是打包的真正过程
  const bundleCode = `
  // 以下代码为打包的三个重要步骤：
  // 1. 构建 modules
  // 2. 构建 webpackRequire，加载模块，模拟 CommonJS 中的 require
  // 3. 运行入口函数
  (()=>{
      // 1. 构建 modules
      const modules = [
        ${modules.map(m => createModuleWrapper(m.code))}
      ]
    
      // 模块缓存，所有模块都仅仅会加载并执行一次
      const cacheModules = {}
    
      // 2. 加载模块，模拟代码中的 require 函数
      // 打包后，实际上根据模块的 ID 加载，并对 module.exports 进行缓存
      function webpackRequire (moduleId) {
        const cachedModule = cacheModules[moduleId]
        if (cachedModule) {
          return cachedModule.exports
        }
        const targetModule = { exports: {} }
        modules[moduleId](targetModule, targetModule.exports, webpackRequire)
        cacheModules[moduleId] = targetModule
        return targetModule.exports
      }
    
      // 3. 运行入口函数
      webpackRequire(0)
    })()
  `
  fs.writeFileSync('./dist/index.js', bundleCode)
}

module.exports = createBundleTemplate
