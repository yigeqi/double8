import {message} from 'antd'
import api from 'api'
import {myLocalStorage} from 'utils'

const setUserInfo = (info) => {
  return {
    type: 'SET_USER_INFO',
    info
  }
}
const removeUserInfo = () => {
  return {
    type: 'REMOVE_USER_INFO'
  }
}

export const login = ({username,password}) => {
  return async(dispatch, getState) => {
    const resp = await api.login(username,password)
    dispatch(setUserInfo(resp))
    message.destroy()
    if (resp.success!==false) {
      myLocalStorage.set('ls_userInfo',resp)
      message.success('登录成功')
    } else {
      message.warning(`登录失败${resp.message}`,5)
    }
  }
}
export const logout = () => {
  return async (dispatch) => {
    await api.logout()
    myLocalStorage.remove('ls_userInfo')
    dispatch(removeUserInfo())
  }
}
export const register = ({username,password}) => {
  return async(dispatch, getState) => {
    const resp = await api.register(username,password)
    message.destroy()
    if (resp.success!==false) {
      message.success('注册成功')
    } else {
      message.warning(`注册失败${resp.message}`,5)
    }
  }
}