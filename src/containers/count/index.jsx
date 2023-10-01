// 引入count的UI組件
import CountUI from '../../componets/Count'
// 引入connect
import {connect} from 'react-redux'

const CountContainer = connect()(CountUI);

export default CountContainer;