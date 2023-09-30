import {INCREMENT,DECREMENT} from '../redux/constant'

export const createIncrementAction = (data) => ({ type: INCREMENT, data: data })
export const createDecrementAction = (data) => ({ type: DECREMENT, data: data })

