### 概念

Redux 有三个核心概念：

- `Action`：“动作”，就是要做的事情
- `Reducer`： “缩减器”，按 Action 的指示，处理老状态，得到新状态，并存入 Store
- `Store`： 仓库，所有状态及用来改变状态的 Reducer 都存放在仓库里

简单说： Action 提供数据给 Store，Store 根据 Action 的数据调用对应的 Reducer 函数，Reducer 函数根据拿到的 Store 中旧的状态和 Action 传给 Store 的信息生成新的状态提供给 Store 更新。

### Action

```js
const countAction = {
  type: "increase",
  payload: 1,
}
// 上面这种是固定的，复用性低，如果要payload为2则需要重新创建一个action

// 下面这种专门用来创建Action的函数叫做 Action Creater
function createCountAction(payload) {
  return {
    type: "increase",
    payload,
  }
}
```

### Reducer

Reducer 是一个普通的函数，**专门用来接收 Action 并生成新的状态**。

- 它是 Redux 进行状态更新的地方（作用类似 Vuex 的 Mutations 方法）

Reducer 函数的特点：

- 函数签名为：`(state, action) => newState`
- 它接收上一次的状态、及当前 Action 对象作为参数，然后根据 Action 中提供的信息（type、payload 等），执行不同的逻辑，最终生成一个新的状态，并返回该新状态
- 它必须是一个`纯函数`（后面会介绍纯函数概念），只做一件事：接收旧的 state 和 action，然后返回新的 state
- 不要在它里面编写具有副作用的代码
- 不要在它内部直接修改旧的 state，而要生成一个新的 state 并返回

```js
export default function reducer(state = 100, action) {
  // 处理各种各样的 Action
  switch (action.type) {
    case "addOne":
      return state + 1

    case "subOne":
      return state - 1

    case "addMore":
      return state + action.payload

    case "subMore":
      return state - action.payload

    default:
      // 默认值
      return state
  }
}
```

```js
export function userReducer(state = { token: "", username: "" }, action) {
  if (action.type === "set_token") {
    return {
      ...state,
      token: action.payload,
    }
  }
  if (action.type === "set_username") {
    return {
      ...state,
      username: action.payload,
    }
  }
  return state
}
```

纯函数的概念：

- 输入参数相同的时候，返回值也总是相同
- 不能再内部调用 Date. now () 或 Math. random () 等方法，会造成返回值不同
- 不能对传入的参数进行修改
- 不能使用全局变量

譬如：数组的 pop、push、splice 是非纯函数，slice 是纯函数

### Store

Store 即状态仓库，他是 Redux 的核心，由它来整合所有的 Action 和 Reducer 一起进行状态管理。

```js
import { createStore } from "redux"
import reducer from "./reducer"
// 创建 Store ,并传入 Reducer 函数
const store = createStore(reducer)

export default store
```

Store 的特点：

- 一个应用只有一个 Store
- 创建 Store 时，应该接收 Reducer 函数作为参数：`const store = createStore(reducer)`
- 要获取状态时，可以通过 `store.getState()` 方法
- 要进行状态更新时，可以通过 `store.dispatch(action)` 方法，将 Action 发送到 Store 中，通知 Reducer 函数的执行

Store 的其他 API：

- 订阅状态的变化：`const unsubscribe = store.subscribe(()=>{})`
- 取消订阅状态的变化：`ubsubscribe()`

核心代码：

```js
import { createStore } from "redux"

// 创建 store
const store = createStore(reducer)

// 更新状态
// dispatch 派遣，派出。标识：分发一个 action，也就是发起状态更新
store.dispatch(action)

// 监听状态变化
const unsubscribe = store.subscribe(() => {
  //状态改变时，执行相应的操作
})

// 取消监听状态变化
unsubscribe()
```

使用示例：

`store/reducers.js`

```js
// 这是 Reducer 函数，接收固定的两个参数
// state 是当前 Store 中的状态
// action 是接收到的 Action 对象
export function countReducer(state = 0, action) {
  if (action.type === "increase") {
    console.log("+1")
    return state + 1
  }
  if (action.type === "decrease") {
    console.log("-1")
    return state - 1
  }
  return state
}
```

`store/index.js`

```js
// 从redux包中导入创建Store的函数
import { createStore } from "redux"

import { countReducer } from "./reducers/count"

// 创建store实例，创建时要传入Reducer函数
const store = createStore(countReducer)

export default store
```

`Parent.jsx`

```jsx
import { useEffect, useState } from "react"
import Child from "./Child"
import store from "./store"

const Parent = () => {
  const [count, setCount] = useState(1)

  // 放到effect中，只设置一次监听
  useEffect(() => {
    // 监听store的数据变化
    store.subscribe(() => {
      // 监听到变化重新获取store中的state
      const state = store.getState()
      setCount(state)
    })
  }, [])

  return (
    <div>
      <h3>I'm Parent Component</h3>
      <div>Parent's data: {count}</div>
      <div>
        <Child />
      </div>
    </div>
  )
}

export default Parent
```

`Child.jsx`

```jsx
// 导入store
import store from "./store"
const Child = () => {
  const increaseHandler = () => {
    // 使用store上的dispatch方法，发送Action对象，执行Reducer中的逻辑
    store.dispatch({
      type: "increase",
    })
  }

  const decreaseHandler = () => {
    store.dispatch({
      type: "decrease",
    })
  }

  return (
    <div>
      <h3>I'm Child Component</h3>
      <button onClick={increaseHandler}>加</button>
      <button onClick={decreaseHandler}>减</button>
    </div>
  )
}

export default Child
```

Redux 初始化逻辑：

> Reducer 初始化时会调用 `reducer(undefined, { type: "@@redux/INITv.a.4.t.t.p" })`，因为第一个参数是 undefined，所以会走默认分支，并根据尝试使用的参数默认值作为初始化后的参数，如果没有默认值则为 `undefined`

### 使用 React-redux 简化 Redux 逻辑

安装：pnpm i react-redux
使用：

1. 在最外层组件中需要从 react-redux 中引入 Provider 组件并包裹最外层组件，并传入 Store 给 Provider

```jsx
import { Provider } from "react-redux"
import { createRoot } from "react-dom/client"
import Parent from "./Parent"

import store from "./store"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Parent />
  </Provider>
)
```

1. 修改状态：调用 react-redux 提供的 `useDispatch` 返回 dispatch，通过该 dispatch 来进行更新数据

```jsx
import { useDispatch } from "react-redux"

const Child = () => {
  const dispatch = useDispatch()
  const increaseHandler = () => {
    dispatch({
      type: "increase",
    })
  }

  const decreaseHandler = () => {
    dispatch({
      type: "decrease",
    })
  }

  return (
    <div>
      <h3>I'm Child Component</h3>
      <button onClick={increaseHandler}>加</button>
      <button onClick={decreaseHandler}>减</button>
    </div>
  )
}

export default Child
```

1. 获得状态：通过调用 react-redux 提供的 `useSelector` 获取状态，useSelector 接收的是一个回调函数，该函数获得的参数是仓库中的状态，并且会在状态改变时重新调用，useSelector 返回的是经过传入的回调处理后的最新状态。

```jsx
import { useSelector } from "react-redux"
import Child from "./Child"

const Parent = () => {
  const count = useSelector((state) => {
    return state
  })

  return (
    <div>
      <h3>I'm Parent Component</h3>
      <div>Parent's data: {count}</div>
      <div>
        <Child />
      </div>
    </div>
  )
}

export default Parent
```

### 合并 Reducer：

```js
// 从redux包中导入创建Store的函数
import { combineReducers, createStore } from "redux"
import { countReducer } from "./reducers/count"
import { userReducer } from "./reducers/user"

// 合并 Reducer
const rootReducer = combineReducers({
  count: countReducer,
  user: userReducer,
})
// 创建store实例，创建时要传入Reducer函数
const store = createStore(rootReducer)

export default store
```

合并后如何使用：

合并后得到的 state 是一个对象，键名是合并时传入对象对应的键名

```jsx
const { count, user } = useSelector((state) => {
  return state
})

return (
  <div>
    <h3>I'm Parent Component</h3>
    <div>Parent's data: {count}</div>
    <div>username: {user.username}</div>
    <div>
      <Child />
    </div>
  </div>
)
```

### 中间件

#### redux-logger

1. 安装： `pnpm i redux-logger`
2. 导入 redux-logger
3. 从 redux 中导入 applyMiddleware 函数
4. 将 applyMiddleware () 调用作为 createStore 函数的第二个参数
5. 调用 applyMiddleware 函数时将 logger 作为参数传入
6. 调用 store. dispatch () 并查看 logger 中间件记录的日志信息

```js
// 1. 导入 applyMiddleware 函数
import { createStore, applyMiddleware } from "redux"

// 2. 导入 logger 中间件包
import logger from "redux-logger"

import rootReducer from "./reducers"

const store = createStore(
  rootReducer,
  // 3. 在这里添加 logger 中间件
  applyMiddleware(logger)
)
```

#### redux-thunk

用来处理异步逻辑

1. 安装：`pnpm i redux-thunk`
2. 导入 `redux-thunk`
3. 将 `redux-thunk` 添加到中间件列表中
4. 修改 Action Creator，让它返回一个函数

说明： 5. 在函数形式的 Action 中，可以执行同步或异步的操作 6. 在操作执行完后，可进一步调用参数上的 `dispatch` 方法分发 Action 将状态更新到 Store 中

```js
// 从redux包中导入创建Store的函数
import { combineReducers, createStore } from "redux"
import { countReducer } from "./reducers/count"
import { userReducer } from "./reducers/user"

import logger from "redux-logger"
import { applyMiddleware } from "redux"

import thunk from "redux-thunk"

const rootReducer = combineReducers({
  count: countReducer,
  user: userReducer,
})

const store = createStore(rootReducer, applyMiddleware(logger, thunk))

export default store
```

定义 Reducer：

```js
export function channelReducer(state = { channels: [] }, action) {
  if (action.type === "set_channels") {
    return {
      ...state,
      channels: action.payload,
    }
  }
  return state
}
```

创建异步的 action 处理：

```js
import axios from "axios"
export function getChannelList() {
  // 需要导出一个函数
  return async (dispatch, getState) => {
    const res = await axios.get("https://toutiao.itheima.net/v1_0/channels")
    console.log(res)
    const channels = res.data.data.channels
    dispatch({
      type: "set_channels",
      payload: channels,
    })
  }
}
```

在组件中使用：

```jsx
import { useDispatch } from "react-redux"
import { getChannelList } from "./store/actions/channel"

const dispatch = useDispatch()
const requestHandler = () => {
  dispatch(getChannelList())
}
```

流程：

> 会在真正 dispatch 之前先执行传入的 getChannelList，在 getChannelList 中异步获取到数据后，才真正 dispatch 更新 store 数据

### 使用 `@reduxjs/toolkit` 的新写法

安装：`pnpm i @reduxjs/toolkit`
使用：

#### 定义 reducer

```js
// export function userReducer(state = { token: '', username: '' }, action) {
//   if (action.type === 'set_token') {
//     return {
//       ...state,
//       token: action.payload
//     }
//   }
//   if (action.type === 'set_username') {
//     return {
//       ...state,
//       username: action.payload
//     }
//   }
//   return state
// }

// 新写法
import { createSlice } from "@reduxjs/toolkit"

export default createSlice({
  name: "user",
  initialState: {
    token: "",
    username: "",
  },
  reducers: {
    set_token(state, action) {
      state.token = action.payload
    },
    set_username(state, action) {
      state.username = action.payload
    },
  },
})
```

定义 Reducer：引入 `createSlice` ，然后按上面的方式定义，`name` 是命名空间，`initialState` 是初始数据。该 createSlice 最终会生成旧的写法。

#### 定义 redux 仓库

```js
// // 从redux包中导入创建Store的函数
// import { combineReducers, createStore } from 'redux'
// import { countReducer } from './reducers/count'
// import { userReducer } from './reducers/user'

// import logger from 'redux-logger'
// import { applyMiddleware } from 'redux'

// import thunk from 'redux-thunk'
// import { channelReducer } from './reducers/channel'

// import { composeWithDevTools } from 'redux-devtools-extension'

// // 合并 Reducer
// const rootReducer = combineReducers({
//   count: countReducer,
//   user: userReducer,
//   channel: channelReducer
// })

// // 创建store实例，创建时要传入Reducer函数
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, thunk)))

// export default store

// 新写法

import { configureStore } from "@reduxjs/toolkit"
import countSlice from "./reducers/count"
import userSlice from "./reducers/user"
import channelSlice from "./reducers/channel"
import { combineReducers } from "redux"

const store = configureStore({
  // reducer
  reducer: combineReducers({
    count: countSlice.reducer,
    user: userSlice.reducer,
    channel: channelSlice.reducer,
  }),
})

export default store
```

导入 `configureStore` ，然后入上使用。其中需要导入之前定义的 reducer，导入后上面的 reducer 就是我们之前 createSlice 生成的 reducer 函数。可以使用 redux 的 combineReducers 合并，这部分写法和旧写法一样。
