### mac 下 pnpm 全局更新报错:

- Run "pnpm setup" to create it automatically, or set the global-bin-dir setting, or the PNPM_HOME env variable. The global bin directory should be in the PATH.

解决: 先执行 `source ~/.zshrc`, 然后再`pnpm add -g pnpm`

### nuxt3 中使用 useFetch 配置 server:false 时页面中直接请求数据不是预期效果的问题

[issue 讨论](https://github.com/nuxt/framework/issues/4548)
nuxt3 开发者说这个表现就是预期的,配置了 server:false 后服务端时会假定发送了请求并返回一个 null 值,配置 await 不会阻止后续逻辑执行。
所以想要对返回值进行相关处理必须使用 watch 或者 computed 等监听返回值的变化。
目前我是使用 setTimeout 解决的,后续再看看还有没有更优雅的方式。
