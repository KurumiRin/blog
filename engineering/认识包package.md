## semver 与版本

semver(semantic versioning)，即语义化版本，由 `[major, minor, patch]` 三部分组成(主版本号、次版本号、修订号)。

- `major`: 当你发布一个含有 Breaking Change 的 API 时，递增 major 版本号（18.0.0）
- `minor`: 当你新增了一个向后兼容的功能时，递增 minor 版本号（17.2.0）
- `patch`: 当你修复了一个向后兼容的 Bug 时，递增 patch 版本号（17.1.2）

在一些大型包的管理中，如果没有正式发布，会选择使用 `prerelease` 的版本号，比如 `1.0.0-alpha`，`1.0.0-alpha.1`，`1.0.0-beta.1`，`1.0.0-rc.1`。

## 版本号范围

手动安装一个 npm 包时，它写在 `package.json` 中的是一个版本号范围。
对于 `~1.2.3` 而言，它的版本号范围是 `>=1.2.3 <1.3.0`。
对于 `^1.2.3` 而言，它的版本号范围是 `>=1.2.3 <2.0.0`。

当我们 `npm i` 时，默认的版本号是 `^` ，可最大限度地在向后兼容与新特性之间做取舍，但是有些库有可能不遵循该规则，我们在项目时应当使用 `yarn.lock/package-lock.json` 锁定版本号。

> 工具：[版本号范围查看器](https://devtool.tech/semver)

#### 版本号计算：

- 计算两个版本号的大小
- 发版时，给固定版本号递增
- 检测版本号是否有效等等

在 `npm` 发包时，`npm` 会调用 `semver` 这个包完成这些事情：

```js
semver.valid("1.2.3") // '1.2.3'
semver.lt("1.2.3", "9.8.7") // true
semver.satisfies("1.2.3", "1.x || >=2.5.0 || 5.0.0 - 7.2.3") // true
```

## 依赖

当使用 `npm i <package>` 时，将会下载最新版本的 `<package>`，并将其写入 `package.json` 中的 `dependencies` 字段中。
如果通过 `npm i -D <package>` 安装，则会写入 `package.json` 的 `devDependencies` 字段中。

#### URI as dependency：

而依赖不仅仅可以以版本号的形式安装，还可以通过 URI 的方式安装，比如：`npm i git+ssh://git@github.com:npm/cli.git`。

在许多公司内，都有通过内部 `git` 仓库的形式安装包，一般场景在对某一公有依赖有小改动，但又不想直接在私有仓库发包。这种场景除了选择 fork 进私有仓库，还可以选择 `patch-package` 的方式。
除此之外，还可以直接通过压缩包及本地文件（`file:`）的形式进行安装。**一般场景在 `monorepo` 或本地调试 package**的情况下。

```json
{
  "dependencies": {
    "npm": "git+ssh://git@github.com:npm/cli.git",
    "foo": "http://xxx.xx.xxx/foo.tar.gz",
    "bar": "file:../bar"
  }
}
```

#### Alias

如果我们需要同时引入两个不同版本的依赖，可使用别名进行依赖安装。

```Bash
$ npm install <alias>@npm:<name>

$ npm install vue2@npm:vue@2
$ npm install vue3@npm:vue@3
```

在 `package.json` 中依赖如下：

```json
{
  "dependencies": {
    "vue2": "npm:vue@2",
    "vue3": "npm:vue@3"
  }
}
```

#### dep 和 devDep

假设一个项目的 `package.json` 如下所示：

```json
{
  "dependencies": {
    "react": "^17.1.0"
  }
}
```

当 `npm i` 时只会下载 `react` 的 `dependencies`，而不会下载 `react` 的 `devDependencies`。

可以在一个空的 `package` 下，直接 `npm i react`，然后查看 `node_modules` 或 `package-lock.json` 文件来验证。

##### dep 和 devDep 二者区别:

对于包(Package)开发而言，是有严格区分的：

- dependencies: 在生产环境中使用
- devDependencies: 在开发环境中使用，如 webpack/babel/eslint 等

当在项目中安装一个依赖时，该依赖的 `dependencies` 也会安装到项目中，即被下载到 `node_modules` 目录中。但是 `devDependencies` 不会。
因此在开发 package 时，需要注意所引用的 `dependencies` 会被使用者一并下载，而 `devDependencies` 不会。

对于业务开发来说，两者区别不大：

当进行业务开发时，严格区分 `dependencies` 与 `devDependencies` 并无必要，实际上，大部分业务项目对二者也并无严格区别。

毕竟业务项目并不会作为其它项目的依赖而使用，因此连业务项目的 name 与 version 字段都是十分随意的。因此对于业务项目而言，一般需要加上一个 private 的字段。

```json
{
  "private": true
}
```

对于打包更没有影响，依靠的是 `Webpack/Rollup` 对代码进行模块依赖分析，与该模块是否在 `dep/devDep` 并无关系，只要在 `node_modules` 上能够找到该 `package` 即可。

#### npm 包的 install size:

`install size`，指 `npm i <pkg>` 时，你真正安装的 npm 包的体积，包含该 `<pkg>` 的所有依赖以及间接依赖（即递归 pkg 的 所有 dependencies 的总体积）。
在 https://pkg-size.dev/ 网站中，可以看到某个依赖的所有间接依赖以及安装体积。

## engines

指定一个项目所需的 node 最小版本，属于一个项目的质量工程。
对于版本不匹配要求报错(yarn)或警告(npm)，那我们需要在 `package.json` 中的 `engines` 字段中指定 Node 版本号

```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

如果本地 node 版本号为 `v10.24.1`，而项目所需版本号为 `>=16.0.0`。
此时 npm 将会警告：

```Bash
npm WARN EBADENGINE Unsupported engine { package: 'next-app@1.0.0',
npm WARN EBADENGINE   required: { node: '>=16.0.0' },
npm WARN EBADENGINE   current: { node: 'v10.24.1', npm: '7.14.0' } }
```

yarn 将会报错：

```Bash
error next-app@1.0.0: The engine "node" is incompatible with this module. Expected version ">=16.0.0". Got "10.24.1"
```

在 yarn 中项目中某些依赖所需要的 Node 版本号与项目运行时的 Node 版本号不匹配，也会报错。

## npm scripts

`npm scripts` 是一种在 javascript 项目中定义脚本的简单方法，仅仅通过 `npm run <command>` 就可以运行对应脚本。它允许通过运行一些命令来自动化大部分常见任务，例如编译代码、运行测试、启动服务器等。它可以让开发者快速开发、构建和部署项目，也使得项目的配置变得更加简单和易于维护。

`npm scripts` 通过 `package.json` 中的 `scripts` 字段进行配置，比如：

```json
{
  "scripts": {
    "dev": "next",
    "start": "next start"
  }
}
```

在 `package.json` 默认的 scripts 有：

- `install`：依赖安装
- `start`：启动服务
- `test`：测试项目
  他们可以通过 `npm <command>` 直接运行，如 `npm install`、`npm start`。
  除了默认的 scripts 外，还有一些约定俗成的脚本，比如：
- `build`：构建打包
- `dev`：开发环境
- `lint`：格式化
  对于此类自定义的 scripts 需要 `npm run <command>` 方可执行。

### script

在 `scripts` 中定义的实际上是命令行工具，因此需要对其有所熟悉，特别是 Linux 命令。
即使大部分为简单的 node.js 所开发的命令行工具，如 `eslint`、`webpack`、`next` 等。但当命令稍显复杂时，仍然有部分 Linux 命令知识需要了解。

### 环境变量

环境变量，如 `NODE_ENV=production <command>` 是 `Linux` 中常见的配置环境变量的方式，在执行命令时读取环境变量 `NODE_ENV` 为 `production`。

在 `windows` 系统中，无法通过此方式读取环境变量，因此需要借助工具 [cross-env](https://github.com/kentcdodds/cross-env) 实现跨平台式的环境变量配置，但是大部分项目均是在 mac/linux 中进行开发及部署，因此许多时候 `corss-env` 无用武之地。

```JSON
{
  "scripts": {
    "dev": "NODE_ENV=production webpack",

    "dev:cross-platform": "cross-env NODE_ENV=production webpack"
  },
}
```

### pre/post script

`npm scripts` 有一些好用的钩子，可以辅助提高我们的工作效率。
使用场景：

1. 在 `npm publish` 发包之前忘记 `npm run build`，导致发包无效
2. 在 `npm start` 启动服务之前需要执行某命令以进行配置数据，但每次都需要记得执行命令，很是繁琐

#### pre/post

`npm scripts` 有两个最为重要的钩子，即 `pre/post`，这些钩子允许我们在 `npm script` 执行前后自动执行自定义脚本，可以用于执行一些预处理或后处理任务。
当我们在手动执行 `npm run xxx` 时，若果 `prexxx` 及 `postxxx` 在 `scripts` 存在时，它将会自动执行 `npm run prexxx` 以及 `npm run postxxx`。

```json
{
  "scripts": {
    "prelint": "echo 'Preparing to lint...'",
    "lint": "eslint",
    "postlint": "echo 'liting complete.'"
  }
}
```

上面的示例在执行 `npm run lint` 时：

```bash
$ npm run lint

> next-app@1.0.0 prelint
> echo 'Preparing to lint...'

Preparing to lint...

> next-app@1.0.0 lint
> eslint

......

> next-app@1.0.0 postlint
> echo 'liting complete.'

liting complete.
```

> 注意：`pnpm` 默认不会执行 `pre/post` 钩子，需要配置 `enable-pre-post-scripts` 为 true

#### lifecycle script

除了 `pre/post` 外，`npm publish` 还有复杂的生命周期。如：

- `npm run prepare`
- [`npm pack`](https://docs.npmjs.com/cli/v9/commands/npm-pack)
- [`npm publish`](https://docs.npmjs.com/cli/v9/commands/npm-publish)

##### prepare

`prepare` 将自动发生在以下两个阶段：

- `npm install` 之后自动执行，因此有时 `prepare` 会代替 `postinstall` 的功能
- `npm publish` 之前自动执行

##### pack

`npm pack` 将当前 npm 包的内容进行压缩打包为 `tarball`，这也是实际上传到 npm 仓库的内容。
在我们 `npm publish` 发包之前，会自动执行 `npm pack` 压缩打包。在 `npm pack` 时，会自动计算出 `integrity` 等信息，方便 `npm i` 时进行完整性校验。

##### publish

`npm publish` 将本地的 npm 包进行 `npm pack` 打包，并上传到 npm 仓库。以下就是 `publish` 相关的钩子，其中最为重要的是 `prepublishOnly` 与 `prepare`。见 [`npm publish`](https://docs.npmjs.com/cli/v8/using-npm/scripts#npm-publish)

- prepublishOnly
- prepack
- prepare
- postpack
- publish
- postpublish

### lockfile

当 `npm i` 时，默认的版本号是 `^` ，能最大限度地在向后兼容与新特性之间做取舍。但是有些库有可能不遵循该规则，所以在项目中应当使用 `yarn.lock/package-lock.json` 锁定版本号。

`package-lock` 的工作流程：

1. `npm i webpack`，此时下载最新 webpack 版本 `5.58.2`，在 `package.json` 中显示为 `webpack: ^5.58.2`，版本号范围是 `>=5.58.2 < 6.0.0`
2. 在 `package-lock.json` 中全局搜索 `webpack`，发现 webpack 的版本是被锁定的，也是说它是确定的 `webpack: 5.58.2`。
3. 经过一个月后，webpack 最新版本为 `5.100.0`，但由于 `webpack` 版本在 `package-lock.json` 中锁死，每次上线时仍然下载 `5.58.2` 版本号。
4. 经过一年后，webpack 最新版本为 `6.0.0`，但由于 `webpack` 版本在 `package-lock.json` 中锁死，且 `package.json` 中 `webpack` 版本号为 `^5.58.2`，与 `package-lock.json` 中为一致的版本范围。每次上线时仍然下载 `5.58.2` 版本号。
5. 或者：经过一年后，webpack 最新版本为 `6.0.0`，需要进行升级，此时手动改写 `package.json` 中 `webpack` 版本号为 `^6.0.0`，与 `package-lock.json` 中不是一致的版本范围。此时 `npm i` 将下载 `6.0.0` 最新版本号，并重写 `package-lock.json` 中锁定的版本号为 `6.0.0` 。

存在问题的流程：

1. `pkg 1.2.3`: 首次在开发环境安装 pkg 库，为此时最新版本 `1.2.3`，`dependencies` 依赖中显示 `^1.2.3`，实际安装版本为 `1.2.3`
2. `pkg 1.19.0`: 在生产环境中上线项目，安装 pkg 库，此时最新版本为 `1.19.0`，满足 `dependencies` 中依赖 `^1.2.3` 范围，实际安装版本为 `1.19.0`，但是 pkg 未遵从 semver 规范，在此过程中引入了 Breaking Change，如何此时 `1.19.0` 有问题的话，那生产环境中的 `1.19.0` 将会导致 bug，且难以调试。

总结：
当 `package-lock.json` 该 package 锁死的版本号符合 `package.json` 中的版本号范围时，将以 `package-lock.json` 锁死版本号为主。
当 `package-lock.json` 该 package 锁死的版本号不符合 `package.json` 中的版本号范围时，将会安装该 package 符合 `package.json` 版本号范围的最新版本号，并重写 `package-lock.json`

### sideeffects 副作用

`sideEffects` 用于指示 npm 包是否具有副作用。副作用是指模块在 `import` 时会执行一些副作用操作，比如修改全局变量、写文件等。

在 `package.json` 中，我们可以通过以下方式配置 `sideEffects`：

```json
{
  "name": "redux",
  "version": "5.0.0-beta.0",
  "sideEffects": false
}
```

在社区中，诸多流行的 npm 包都标注了 sideEffects 该字段，如：

- [redux](https://github.com/reduxjs/redux/blob/master/package.json)
- [rxjs](https://github.com/ReactiveX/rxjs/blob/master/package.json)
- [mobx](https://github.com/mobxjs/mobx/blob/main/packages/mobx/package.json)

当 `sideEffects:false` 时，这将触发 webpack 等打包器的 `Tree Shaking` 优化，它会安全地**删除未使用的模块，减小最终打包体积**。然而，有时虽然大部分模块无副作用，但仍然存在一些特定的模块具有副作用。在这种情况下，可以将 `sideEffects` 设置为一个数组，指定具有副作用的模块列表。

```json
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
}
```
