import axios from 'axios'
import config from 'config'
import store from 'src/store'
import {showModal} from 'actions/component'
import {message} from 'antd'

const instance = axios.create({
  baseURL: config.baseURL,
  withCredentials:true // enable req with cookie，允许跨域请求携带Cookie
})
instance.interceptors.request.use(config=>{
  console.log('show progress')
  return config
}, err=>{
  console.log(err.request)
  message.error('请求错误，'+err.message)
  return Promise.reject(err)
})
instance.interceptors.response.use(rep=>{
  console.log('hide progress')
  return rep
},err=>{
  if (err.response && err.response.status === 401) {
    console.log('401!')
    store.dispatch(showModal('LoginModal'))
    message.error('请先登录')
    return err.response
  }
  let msg = err.message
  if (err.response&&err.response.data) {
    msg = msg + ','+err.response.data.message
  }
  message.error('请求错误，'+msg)
  return Promise.reject(err)
})

export const api = {
  login (username,password) {
    return instance.post(config.path.login, {username,password}).then(resp=>resp.data)
  },
  logout () {
    return instance.get(config.path.logout).then(resp=>resp)
  },
  register (username,password) {
    return instance.post(config.path.register, {username,password}).then(resp=>resp.data)
  },
  justtest () {
    return instance.get('/justtest').then(resp=>resp)
  }
}
export default api