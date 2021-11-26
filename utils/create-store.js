import { createStore,applyMiddleware } from'redux'
import thunk from 'redux-thunk'

const reducer = (state = { }, action) => {
    let _state
    switch (action.type) {
        case 'CHANGE_LIST':
            _state={
                    ...state,
                    list:action.list
            }
            break 
        default:
            _state= {...state,...action.data}
    }
    return _state
}

const getStore = () => {
    const initState=typeof window !== "undefined" && window.INIT_STATE ?window.INIT_STATE:{}
    return createStore(reducer,initState,applyMiddleware(thunk))
}

export default getStore