import { combineReducers } from 'redux'
import user from './user'
import component from './component'

const rootReducers = combineReducers({
  user,
  component
})

export default rootReducers