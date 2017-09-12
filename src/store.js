import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from 'reducers'
import logger from 'redux-logger'

let arr = [thunkMiddleware]
if (process.env.NODE_ENV==='development'){
  arr.push(logger)
}
const store = createStore(
  rootReducer,
  applyMiddleware(...arr)
)

export default store