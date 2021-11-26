import { createStore,applyMiddleware } from'redux'
import thunk from 'redux-thunk'

const reducer = (state = { name:'simon',list:[] }, action) => {
    let _state
    switch (action.type) {
        case 'CHANGE_LIST':
            _state={
                    ...state,
                    list:action.list
            }
            break 
        default:
            _state= {...state}
    }
    return _state
}

const getStore = () => {
    return createStore(reducer,applyMiddleware(thunk))
}

export default getStore