
import express from 'express'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'//引入renderToString方法
import { Provider } from 'react-redux'
import { matchRoutes, renderRoutes } from 'react-router-config';
import routes from './routes';

import createStore from './utils/create-store'

const app = express()
app.use(express.static('public'));

app.get('*', (req, res) => {
    const store = createStore();

    const matchedRoutes = matchRoutes(routes, req.path)
    const promises = [];

    matchedRoutes.forEach(item => {
        if (item.route.getInitialProps) {
            promises.push(new Promise((resolve) => {
                /**
                 * 问题就是怎么保证 getInitialProps 运行完毕store中的数据更新了
                 * 如果 getInitialProps 是异步的
                 * 
                 * 其实只要保证 getInitialProps 返回一个 promise实例，不用考虑它嵌套了几层
                 * 只要最里面的一层函数返回promise实例，那么 getInitialProps 返回的就是一个单纯的promise实例
                 * 这样子，只要保证最里面的函数中的异步操作执行完毕就可以执行 resolve 函数了
                 * 一旦执行完毕 resolve 函数，就会开始调用then函数
                 * 链式调用，在最里面的函数中会调用一次then，改变store
                 * 这样子，等到这里第二个then中去 渲染页面的时候，store中的数据已经更新了
                 */
                item.route.getInitialProps(store).then(resolve)
            }));
        };
    })

    Promise.all(promises).then(() => {
        //此时该有的数据都已经到store里面去了
        //执行渲染的过程(res.send操作)
        const content = renderToString((
            <Provider store={store}>
                <StaticRouter location={req.path} context={{}}>
                    {renderRoutes(routes)}
                </StaticRouter>
            </Provider>

        ))
        // 由于node端无法添加事件，因此当这些字符串被浏览器解析完成之后，还需要再进行一遍客户端渲染
        // 于是需要引用一段新的js代码用来 做客户端渲染
        // 这段客户端代码通过webpack打包后放在了一个目录中，我们只需要引用它即可
        res.send(`
        <script>
            window.INIT_STATE = ${JSON.stringify(store.getState())}
        </script>
        <body>
            <div id='root'>${content}</div>
            <script src="/index.js"></script>
            
        </body>
        `)
    })


})

app.listen(3000, () => console.log('Exampleapp listening on port 3000!'))