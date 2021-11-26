## 为什么需要react ssr？
1. 客户端渲染在js代码执行完毕前，页面展示不全。ssr 返回的html文件中就已经有当前路由的html结构以及样式，无需js代码执行就可以完整展示页面，用户体验更好。

2. 客户端渲染由于返回的html结构过于简单，seo效果非常差。

## react ssr如何完成？
简单说就是启动node服务器，并返回处理过的html字符串，客户端拿到后直接渲染.
#### 1.如何处理html字符串
    1. 利用react-router的StaticRouter来识别出当前路由需要渲染的react组件，再利用「renderToString」将react组件转化为字符串

    2. 由于html无法识别react代码，因此需要打包server端代码（打包后jsx代码转化为了React.createElement方法），再启动服务器，返回html文件

    3. 由于「renderToString」无法处理react组件上的事件绑定，因此返回的html文件需要引用一个js文件，这个js文件在客户端执行「reactDom.hydrate」方法来将事件都绑定上。

#### 2.于是，客户端也需要打一个包，来提供js文件来执行「reactDom.hydrate」

#### 3.异步数据如何同步（注水、脱水）
    1.通过在每个react组件实例上创建静态方法，利用promise来控制顺序，在服务端返回html字符串之前，执行这些静态方法，获取需要的数据.
    然后塞入服务端的store中，之后再返回html字符串

    2.这样子返回，由于客户端执行js代码的时候还会再创建store，因此服务端中store的数据不会被客户端用到。
    因此，在返回html的时候，还需要改造。
    通过定义一个全局变量存放服务端中的store数据。客户端创建store的时候，从全局变量拿作为初始数据，就可以拿到服务端store的数据了

#### 4.样式直出
    1. 利用 isomorphic-style-loader ，在react组件中引入样式文件（本质上是一个js对象）的时候，往这个对象添加了一些方法「_getCss」、「_insertCss」等

    2. 同时，当服务端执行「renderToString」的时候，会执行react组件的部分生命周期函数，在 componentWillmount的时候 往最上层的stateRouter的staticContext添加当前组件的样式字符串：this.props.staticContext.css.push(styles._getCss());

    3. 「renderToString」执行完毕，context的值由于传入的是对象，renderToString」执行的时候修改这个值，外部传入的context变量同样可以拿到修改后的值。拿这个context，获取当前组件的css代码字符串，插入style标签，再插入到html中，最后返回到客户端