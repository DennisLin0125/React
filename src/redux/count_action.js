import { INCREMENT, DECREMENT } from '../redux/constant'

export const createIncrementAction = (data) => ({ type: INCREMENT, data: data })
export const createDecrementAction = (data) => ({ type: DECREMENT, data: data })

// 所謂的異步Actoin就是回傳為function
export const createIncrementAsyncAction = (data,time) => { 
    return (dispatch) => {
        setTimeout(() => {
            dispatch(createIncrementAction(data))
        },time)
    }
}