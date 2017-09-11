const componentInit = {currentModal:''}
const component = (state = componentInit, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return Object.assign({},state,{currentModal:action.modalName})
    default:
      return state
  }
}

export default component