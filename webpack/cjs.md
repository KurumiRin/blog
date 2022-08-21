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

- `__webpack_exports__` 用来供写 library 导出 API，这里没有用到，可以忽略

### Question: 在 CommonJS 中，如果不对 module 进行缓存即不实现以上的 `__webpack_module_cache__` 数据结构有什么问题?

会导致多次计算从`__webpack_modules__`中获取模块,浪费性能且违反单例模式。
如果模块中存在不期望多次执行的行为,多次计算获取模块会导致该行为的多次发生。
因为地址非缓存导致的其他问题。

### Question: 在 Common.js 中 `module.exports` 和 `exports` 有什么区别?

```js
var __webpack_modules__ = [, (module, exports) => {}];
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
```

`exports` 是 `module.exports` 的引用,如果不对 `exports` 重新赋值,则没有区别。具体可以看[月哥的文章](https://github.com/shfshanyue/Daily-Question/issues/351)

重新赋值后呢？

```js
var __webpack_modules__ = [
  ,
  (module, exports) => {
    module.exports = {
      a: 0,
    };
    exports = {
      b: 0,
    };
  },
];

var module = {
  exports: {},
};

__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
```

我们观察上面的代码,就会发现 `__webpack_modules__`中的`模块 1`接收到的 `exports` 就是`module.exports`的引用。
`module.exports` 的赋值会将外部的 `module.exports` 赋值新内存地址为 `{a:0}` , 而`模块 1` 内部的 `exports` 重新赋值只是会给`模块 1` 的形参`exports`所指向的旧的内存地址赋值,所有没有任何意义,是错误的。
