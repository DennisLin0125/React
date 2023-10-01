// 引入count的UI組件
import CountUI from '../../componets/Count'
// 引入connect
import { connect } from 'react-redux'

import {
    createIncrementAction,
    createDecrementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'


const CountContainer = connect(
    // mapStateToProps
    (state) => ({ count: state.count }),

    // mapDispatchToProps的一般寫法
    // (dispatch) => ({
    //     add: (data) => dispatch(createIncrementAction(data)),
    //     sub: (data) => dispatch(createDecrementAction(data)),
    //     async: (data, time) => dispatch(createIncrementAsyncAction(data, time)),
    // })

    // mapDispatchToProps的精簡寫法
    {
        add: createIncrementAction,
        sub: createDecrementAction,
        async: createIncrementAsyncAction
    }

)(CountUI);

export default CountContainer;