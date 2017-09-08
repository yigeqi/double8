import axios from 'axios'
import config from '../config'
import {message} from 'antd'

const instance = axios.create({
  baseURL: config.baseURL,
  withCredentials:true // enable req with cookie
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
  let msg = err.message
  if (err.response) {
    msg = msg + ','+err.response.data.message
  }
  message.error('请求错误，'+msg)
  return Promise.reject(err)
})

export const api = {
  login () {
    return instance.post(config.path.login, {username: 'test1',password:'1'}).then(resp=>resp.data)
  },
  logout () {
    return instance.get(config.path.logout).then(resp=>resp)
  },
  register () {
    return instance.post(config.path.register, {username:'test1',password:'1'}).then(resp=>resp.data)
  },
  justtest () {
    return instance.get('/justtest').then(resp=>resp)
  }
}
export default api