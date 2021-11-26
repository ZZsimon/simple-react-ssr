import React from 'react'                   //引入React以支持JSX
import { Route, Switch } from 'react-router-dom'    //引入路由
import Home from './demo'        //引入Home组件
import Login from './Login'        //引入Home组件


export default function App() {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
        </Switch>
    )
}