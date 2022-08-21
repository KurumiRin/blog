## cjs 运行时分析

> 先打包一个简单的静态资源

`index.js`

```js
const sum = require("./sum");

console.log(sum(3, 8));
```

`sum.js`

```js
module.exports = (...args) => args.reduce((x, y) => x + y, 0);
```

打包得到:

```js
var __webpack_modules__ = [
  ,
  (module) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);
  },
];
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  return module.exports;
}

var __webpack_exports__ = {};

(() => {
  const sum = __webpack_require__(1);

  sum(3, 8);
})();
```

> 分析打包后的运行时代码

- `__webpack_modules__` 声明有所有模块的数组

- `__webpack_module_cache__` 缓存已调用模块

- `__webpack_require__` 加载(获取)模块的函数

- `__webpack_exports__` 用来供 library 导出 API，这里没有用到，可以忽略
