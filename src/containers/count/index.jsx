// 引入count的UI組件
import CountUI from '../../componets/Count'
// 引入connect
import { connect } from 'react-redux'

import {
    createIncrementAction,
    createDecrementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'

// mapStateToProbs函數的返回值作為狀態值傳給了UI組件
function mapStateToProbs(state) {
    return { count: state.count }
}
function mapDispatchToProbs(dispatch) {
    return {
        add: (data) => dispatch(createIncrementAction(data)),
        sub: (data) => dispatch(createDecrementAction(data)),
        async: (data, time) => dispatch(createIncrementAsyncAction(data, time)),
    }
}

const CountContainer = connect(mapStateToProbs, mapDispatchToProbs)(CountUI);

export default CountContainer;