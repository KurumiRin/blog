## 文件名中的 hash

1. 什么是`Long Term Cache`,有何作用?

   在服务端在资源的响应头中可以设置强缓存,如设置`Cache-Control: public,max-age=31536000,immutable` ,既可以对资源强缓存一年。

   - 注意: 仅设置 `max-ahe`, 在用户显示的刷新页面时还是会请求服务器进行校验,需要设置`immutable`。作用是当资源未过期且在服务器上不发生改变时,不会重新发送验证请求头来检查更新。

   强缓存的作用: 配置强缓存可以尽可能复用浏览器缓存文件,可以减少资源的获取和加载速度,减小服务器压力。

2. 为什么配置`output.filename` 时不建议注入版本号。

   因为每次更新版本,版本号都会变动。而改动一般较小,大部分资源都是不变的。如果注入了版本号,会导致每次版本号变更时,所有的资源缓存失效,需要重新获取加载资源。这是没有必要的。

3. 为什么可以配置`Long Term Cache` ?

   因为资源文件不变时,生成的带有 hash 值的文件名也不变,那么此时浏览器的缓存就可以一直存在,避免再次请求对应的资源。但是也要注意对应的配置来尽可能减少缓存的失效。

   ```js
   // webpack.config.js
   module.exports = {
     output: {
       // Before
       filename: "bundle.[chunkhash].js",
       // After
       filename: "[name].[chunkhash].js",
     },
   };
   ```

   如上,如果我们配置`bundle.[chunkhash].js`会导致所有依赖项在同一个模块中,有一处更改会导致整个依赖项缓存全部失效。所以我们可以将每个依赖项提取到单独的模块中。为了尽可能的减少依赖缓存的失效,还有其他的配置,具体可以看该[文章](https://web.dev/use-long-term-caching/)

4. 如何提升 webpack 编译时期计算 hash 的速度

   webpack 默认情况下使用的是`md4`hash 函数来生成 hash 值,我们可以通过更换 hash 函数来提高计算 hash 的速度。

   - [webpack 默认支持的 hash 函数](https://github.com/webpack/webpack/blob/main/lib/util/createHash.js)

   可以看到 webpack 内置支持了三个 hash 函数,当然我们也可以额外提供其他的 hash 函数。

   - xxhash64
   - md4
   - native-md4

   通过配置`output.hashFunction`为`xxhash64`我们就可以加快 webpack 编译时计算 hash 的速度,具体可见[官方文档](https://webpack.js.org/configuration/output/#outputhashfunction)。
   同时在`next.js`和`vue-cli`中,webpack 的 hash 函数已经默认为`xxhash64`。详情可见: [next.js](https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack-config.ts#L1426) 、 [vue-cli](https://github.com/vuejs/vue-cli/blob/v5.0.8/packages/@vue/cli-service/lib/config/base.js#L14)

5. 在 Node.js 中如何进行 hash 计算?

在[webpack 源码](https://github.com/webpack/webpack/blob/main/lib/util/createHash.js)中可以看到 [node.js](https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding) 使用的是[`crypto`](https://www.npmjs.com/package/crypto-js)进行 hash 计算的。
