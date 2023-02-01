```jsx
import React from "react"
const el = React.createElement(
  "div",
  {
    id: "my_div",
    className: "container",
    style: {
      color: "red",
      fontSize: "32px",
    },
    onClick() {
      alert("naive")
    },
  },
  // 如果需要添加子元素可以传数组，也可以继续传节点
  // [dom1,dom2] 或 ,dom1,dom2
  "Hello,world"
)

// React 17
// import ReactDom from 'react-dom';
// ReactDom.render(el, document.getElementById('root'))

// React 18
import ReactDOMClient from "react-dom/client"
const root = ReactDOMClient.createRoot(document.getElementById("root"))
root.render(el)
```

#### React 中的 this 和事件对象

```jsx
import { Component } from "react"
class test1 extends Component {
  onClick1(e) {
    console.log(e)
  }

  onClick2(id, e) {
    console.log(e)
  }

  onClick3() {
    // test1 undefined
    console.log(this)
  }

  onClick4 = () => {
    console.log(this)
  }

  render() {
    return (
      <div>
        <button onClick={this.onClick}>test event1</button>
        <button
          onClick={(e) => {
            this.onClick2(1, e)
          }}
        >
          test event2
        </button>
        <button onClick={this.onClick3}>test this1</button>
        <button onClick={this.onClick3.bind(this)}>test this2</button>
        <button onClick={() => this.onClick3()}>test this3</button>
        <button onClick={this.onClick4}>test this4</button>
      </div>
    )
  }
}
```

#### React 中的状态和修改状态

```jsx
import { Component } from "react"
class Counter extends Component {
  state = {
    count: 0,
  }
  increaseHandler = () => {
    this.setState({
      count: this.state.count + 1,
    })
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.increaseHandler}>+1</button>
      </div>
    )
  }
}
```

#### 受控组件

> input

```jsx
class Counter extends Component {
  state = {
    message: "请输入内容",
  }
  onChange = (e) => {
    console.log(e)
    this.setState({
      message: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.message} onChange={this.onChange} />
      </div>
    )
  }
}
```

#### 非受控

> input

```jsx
import { Component, createRef } from "react"

class Counter extends Component {
  constructor(props) {
    super(props)
    // 创建一个能引用dom元素的对象，放到当前类的属性上
    this.inputRef = createRef(null)
  }

  state = {
    message: "请输入内容",
  }

  onClick = () => {
    //获取inputRef里的dom元素
    const el = this.inputRef.current
    console.log(el.value)
  }

  render() {
    return (
      <div>
        <input ref={this.inputRef} type="text" />
        <button onClick={this.onClick}>获取输入内容</button>
      </div>
    )
  }
}
```

### 父子组件及组件传值

Parent. jsx

```jsx
import { Component } from "react"
import Child from "./Child"
import FunctionChild from "./FunctionChild"

class Parent extends Component {
  state = {
    messgae: "I'm parent",
  }
  render() {
    return (
      <div>
        <h1>父组件</h1>
        <Child a={this.state.messgae} b={123} c={true} />
        <FunctionChild a={this.state.messgae} b={123} c={true}>
          {"函数子组件标签内容"}
        </FunctionChild>
        <Child>{"标签内容,通过children获取"}</Child>
      </div>
    )
  }
}

export default Parent
```

Child. jsx

```jsx
import { Component } from "react"

class Child extends Component {
  // 方式一：从构造函数的参数获取
  constructor(props) {
    super(props)
    console.log("class child constructor", props)
  }
  render() {
    // 方式二：通过this.props 获取 props
    console.log("class child", this.props)
    return (
      <div>
        <h4>
          子组件
          {this.props.children}
        </h4>
      </div>
    )
  }
}

export default Child
```

FunctionChild. jsx

```jsx
const FunctionChild = (props) => {
  return (
    <div>
      <h4>
        函数子组件: {props.a} | {props.b} | {props.c} |{props.children}
      </h4>
    </div>
  )
}

export default FunctionChild
```

### Context 使用 Provider 和 Consumer

首先创建状态仓库并导出：

```js
// store.js
import { createContext } from "react"

const MyContext = createContext()

export default MyContext
```

在父组件中导入仓库：

```jsx
import { Component } from "react"
import Child1 from "./Child1"
import Child2 from "./Child2"

// 导入context
import MyContext from "./store"

class Paraent extends Component {
  state = {
    message: "parent组件的数据",
  }

  render() {
    return (
      <MyContext.Provider value={{ msg: this.state.message }}>
        <div>
          <h1>父组件</h1>
          <Child1></Child1>
          <Child2></Child2>
        </div>
      </MyContext.Provider>
    )
  }
}

export default Paraent
```

在组件外包裹 Provider，并将要传入的数据写在 value 上，需要是一个对象格式。

在子组件中导入仓库：

```jsx
import { Component } from "react"
import MyContext from "./store"

class Child1 extends Component {
  render() {
    return (
      <MyContext.Consumer>
        {(data) => {
          return (
            <div>
              <h3>子组件1</h3>
              <p>{data.msg}</p>
            </div>
          )
        }}
      </MyContext.Consumer>
    )
  }
}

export default Child1
```

在需要接收的子组件外包裹一层 Consumer，然后内部需要一个函数，接收一个 data 参数，该参数就是父组件中 Provider 上传入的 value 对象。

### props 校验

安装 prop-types 进行 props 校验

使用方法：

```jsx
import PorpTypes from "prop-types"
class Counter extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
  }
  static defaultProps = {
    step: 0,
  }
  // ......
}
//Counter.propTypes = {
//	step:PropTypes.number.isRequired
//}

// 默认值
//Counter.defaultProps = {
//	step: 0
//}
```

### React 生命周期

1. constructor
2. render
3. componentDidMount
4. render
5. componentDidUpdate
6. componentWillUnmount

```jsx
//强制更新
fn = () => {
  this.forceUpdate()
}
```

初始化时设置 state，如果在 constructor 中设置，则直接对 state 进行修改，不能使用 setState：

```jsx
  constructor(props) {
    super(props)
    const list = JSON.parse(localStorage.getItem("list") || "[]")
    this.state.list = list
  }
```

或者在 `ComponentDidMount` 中进行修改：

```jsx
  componentDidMount() {
    const list = JSON.parse(localStorage.getItem("list") || "[]")
    this.setState({
      list: list,
    })
  }
```

### setState 的注意点

setState 如果多次调用只会执行最后一次的 setState

```jsx
//如果想要多次执行，需要传入函数：
fn = () => {
  this.setState((preState) => {
    return {
      count: preState.count + 1,
    }
  })
  this.setState((preState) => {
    return {
      count: preState.count + 1,
    }
  })
  this.setState((preState) => {
    return {
      count: preState.count + 1,
    }
  })
}
```

setState 的第二个参数是一个回调函数，会在状态更新后执行：

```jsx
this.setState(
  {
    name: "xxx",
  },
  () => {
    console.log(this.state.name)
  }
)
```

- setState 的同步/异步：
  setState 本身是同步的，但是 React 会处理导致：
  在 `生命周期函数` 和 `事件处理函数` 中被调用，表现为 `异步`
  在 React17 和之前版本中 `setTimeout/setTimeInterval` 或 `原生事件监听函数` 中被调用，表现为 `同步` 。
  而 React18 后 `setTimeout/setTimeInterval` 中调用表现为 `同步`

## 函数组件

### useState

> 使用 `useState` 创建一个新的状态，返回的是一个数组，数组有 2 个元素。
> 第一个是状态，第二个是更新状态的函数

useState 初始数据分两种：

```jsx
//明确的初始值：
useState(100)
//不确定的初始值：
useState(() => {
  return "初始值：" + Date.now()
})

//如果使用
useState("初始值：" + Date.now())
//效果一样，但是会在页面状态改变时重复初始化，消耗不必要的性能
```

```jsx
import { useState } from "react"

const HookTest = () => {
  const countState = useState(0)

  // 第一个元素就是状态
  let count = countState[0]
  // 第二个元素是用来更新状态的函数，相当于类组件中的 this.setState()
  const setCount = countState[1]

  const clickHandler = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <h3>count: {count}</h3>
      <button onClick={clickHandler}>+ 1</button>
    </div>
  )
}
export default HookTest
```

获取 useState 的状态和方法还可以通过来简化：

```jsx
const [messgae, setMessage] = useState("messgae")
```

useState 注意点：不能再函数组件和自定义 hooks 函数之外的地方使用，不能在条件判断和循环遍历的代码块中调用。

### useEffect

React 组件的副作用：对 React 组件来说，除了根据数据渲染界面，其他操作都属于副作用，如 DOM 操作、本地存储操作、发送网络请求等。

注意：useEffect 传入的函数不能使用 async 修饰。

在函数组件中编写副作用代码时，需要在 useEffect 中编写。

```jsx
import { useEffect } from "react"

const EffectTest = () => {
  useEffect(() => {
    // 用来编写带有副作用的函数，比如 DOM操作
    const el = document.getElementById("title")
    el.innerHTML = "被操作后的DOM元素"
  })

  return (
    <div>
      <h4 id="title">函数组件</h4>
    </div>
  )
}

export default EffectTest
```

useEffect 如果没有第二个参数，则是当组件中任何状态改变时都会被触发。
如果想要对某个状态进行"监听"，则传入第二个参数：

```jsx
import { useEffect, useState } from "react"
const [msg, setMsg] = useState("hello")
const EffectTest = () => {
  useEffect(() => {
    console.log("new hello")
  }, [msg])

  const clickHandler = () => {
    setMsg("hello" + Date.now())
  }
  return (
    <div>
      <h4 id="title">函数组件</h4>
      <button onClick={clickHandler}>更新</button>
    </div>
  )
}

export default EffectTest
```

这样就只会当 msg 状态改变时，useEffect 的回调才会被执行。

如果给 useEffect 的第二个参数传入空数组，则该回调函数只会在初次渲染后执行一次，后续状态变化不会再执行。

useEffect 的副作用销毁：

> useEffect 中 return 一个函数，该函数会在组件销毁时或组件更新前执行。

```jsx
useEffect(() => {
  //在组件初次渲染后执行

  return () => {
    //该回调函数会在组件销毁时执行
  }
}, [])

// 下面这个使用较少
useEffect(() => {
  //在组件初次渲染后或组件状态更新后执行

  return () => {
    //该回调函数会在组件状态更新前执行
  }
}, [state])
```

### useRef

使用 useRef 来操作或获取 dom

```jsx
import { useRef } from "react"

const TestRef = () => {
  const inputRef = useRef(null)
  const clickHandler = () => {
    const value = inputRef.current.value
    console.log(inputRef)
    console.log(value)
  }

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={clickHandler}>Click</button>
    </div>
  )
}

export default TestRef
```

ref 绑定好 useRef 返回值后，通过返回值的 current 来获取 dom 对象

### useContext

```jsx
// store.js
import { createContext } from "react"
const appContext = createContext()
export default appContext

// 子组件中通过useContext获取context
import appContext from "./store.js"
import { useContext } from "react"

const TestContext = () => {
  const context = useContext(appContext)
  // ...
  // 通过context就可以获取Provider过来的数据，而不需要Consumer才能获取
}
```
