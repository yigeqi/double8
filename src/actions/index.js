import api from 'api'

let nextTodoId = 0
export const addTodo = text => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
}

export const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

export const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

export const login = () => {
  return async(dispatch, getState) => {
    const resp = await api.login()
    console.log(resp)
    dispatch(addTodo('sssssssssssss'))
  }
}