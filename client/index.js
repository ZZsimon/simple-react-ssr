import React from 'react'
import reactDom from 'react-dom'
import { BrowserRouter } from'react-router-dom'
import { renderRoutes } from 'react-router-config';
import createStore from '../utils/create-store'
import { Provider } from 'react-redux'
import routes  from '../routes';

// hydrate方法主要是用来第一次渲染，做到复用已经存在的DOM节点，避免重新创建DOM节点，即可以提升页面渲染速度
// 至于绑定事件的功能，render方法也可以做到
reactDom.hydrate(
    <Provider store={createStore()}>
        <BrowserRouter>
        {renderRoutes(routes)}
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)
 