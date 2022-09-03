## cjs 与 esm

1. 什么是 esm/commonjs

   [ES6 模块与 Commonjs 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

   #### commonjs

   commonjs 是 Node 的模块规范,在 cjs 中导入导出模块使用(cjs 是动态加载,所以可以直接 require 变量:`` require(`./${a}`) ``):

   ```ts
   //  导出
   exports.a = "a";
   module.exports = {
     a: "a",
   };

   // 导入
   const { a } = require("./index.js");
   ```

   commonjs 的加载是同步的,每个模块需要等待加载完毕才会继续执行后续逻辑。commonjs 在浏览器环境下无法使用,但是 webpack 等会对 cjs 模块进行解析,所以在前端项目中使用 webpack 时可以使用 commonjs 进行导入导出模块。

   commonjs 模块导入的值是拷贝值,一旦导出,后续对模块内部值的修改不会影响已经导出的值(如果是引用类型数据,会影响)。

   #### esm

   esm 是 ECMAScript 提出的模块化规范,在浏览器与 node 环境下均支持。esm 使用`improt/export`进行模块导入导出。

   ```ts
   //  导出多个内容
   export const a = "a";
   export const b = "b";
   //  或
   const a = "a";
   const b = "b";
   export { a, b };
   // 导入
   import { a } from "./index.js";
   <!-- 默认导出导入 -->
   //  默认导出
   export default function c() {}
   // 默认导入
   import a from "./index.js";
   // 或
   import { default as a } from "./index.js";
   ```

   esm 的模块加载时异步的。
   esm 的静态导入可以在编译时期进行 tree sharking(树摇),减少最终生成的代码体积。
   esm 导出的值时是引用值,导入值时只读的,不能进行修改。
   esm 提供了动态加载模块的 API: `import(module)`

2. 什么是 import(module)

   import(module)是 esm 提供的动态导入模块的 API。

   ```ts
   const xx = await import("https://xx.xxx");
   xx.default(1000);
   ```

   import(module)导入的是一个 Promise,import(module)无法被 tree shaking,尽可能避免使用动态导入。
