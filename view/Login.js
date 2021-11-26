import React from 'react'
import { connect } from 'react-redux'


//使用redux-thunk,在action中写axios并dispatch
const getData = () => {
    return (dispatch) => {
        //接收来自mapDispatchToProps的dispatch方法
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(['上海', '北京'])
            }, 1000)
        }).then((data) => {
            dispatch({ type: 'CHANGE_LIST', list: data })
        })
    }
}

class Login extends React.Component {
    //数据预取方法  静态 异步 方法
    static async getInitialProps(store) {
        return store.dispatch(getData())
    }

    //在componentDidMount中发送异步请求
    componentDidMount() {
        // this.props.getList()
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <h2>store中的数据：{this.props.name}</h2>

                {this.props.list ?
                    <h4>
                        {this.props.list.map(item => (
                            <div key={item}>{item}</div>
                        ))}
                    </h4> : ''}
            </div>
        )
    }
}

function incrementAsync() {
    return dispatch => {
        setTimeout(() => {
            // Yay! Can invoke sync or async actions with `dispatch`
            dispatch(increment())
        }, 1000)
    }
}

const mapStateToProps = state => ({
    name: state.name,
    list: state.list
})

const mapDispatchToProps = dispatch => ({
    getList() {
        //调用dispatch时会自动执行getData里return的方法
        dispatch(getData())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)