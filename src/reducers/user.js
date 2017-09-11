const userInit = {username:''}
const user = (state = userInit, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return Object.assign({},state,action.info)
    case 'REMOVE_USER_INFO':
      return userInit
    default:
      return state
  }
}

export default user