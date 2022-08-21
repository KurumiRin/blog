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
