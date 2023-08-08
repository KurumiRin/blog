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
