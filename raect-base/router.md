### Hash 路由实现方式

```js
window.onhashchange = () => {
  const hash = window.location.hash
  console.log(hash)

  if (hash === "#/home") {
    loadPage1()
  } else if (hash === "#/login") {
    loadPage2()
  } else {
    loadPage()
  }
}
```

### React -router 路由库的使用

#### v5 版本：

安装：`pnpm i react-router-dom@5.3.0`
使用：

```jsx
import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter, BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
	// hash模式路由
	<HashRouter>
	    <App />
	</HashRouter>

	{
		// history路由
		//<BrowserRouter>
		//	<App/>
		//</BrowserRouter>
	}
)
```

```jsx
import { Route } from 'react-router-dom'
import Home from './page/Home'
import About from './page/About'

const App = () => {
	return (
		<div>
			{//模糊匹配}
			<Route path="/" component={Home} ></Route>
			{// 精准匹配}
			<Route path="/About" component={About} exact></Route>
			{
			// <Route path="/About" exact>
			//    <About/>
			// </Route>
			}
		</div>
	)
}
```

#### Link 与 NavLink

**`Link` 组件：**

- 最终会渲染成 `<a>` 标签
- `to` 属性，将来会渲染成 a 标签的 href 属性
- `Link` 组件无法实现导航的高亮效果

**`NavLink`组件：**

- 一个加强版 `Link`组件，能实现当前导航的高亮
- `to` 属性，用于指定地址，会渲染成 a 标签的 href 属性
- `activeClassName`: 用于指定高亮的类名，默认`active`
- `exact` : 精确匹配，表示必须精确匹配类名才生效

#### v6 版本

```jsx
{//没有该写法了}
<Route path="/" exact>
	<Home/>
</Route>
```

```jsx
{
  //v5中
  // <Route path="/" component={Home} exact></Route>
}

{
  // v6中
}
;<Routes>
  <Route path="/" element={<Home />} exact="true"></Route>
  <Route path="/About" element={<About />} exact="true"></Route>
</Routes>
```
