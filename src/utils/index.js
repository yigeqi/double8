const myLocalStorage = {
  get (key) {
    return window.localStorage&&window.localStorage.getItem(key) && JSON.parse(window.localStorage.getItem(key))
  },
  set(key, value) {
    window.localStorage&&window.localStorage.setItem(key, JSON.stringify(value))
  },
  remove (key) {
    window.localStorage&&window.localStorage.removeItem(key)
  }
}

export {
  myLocalStorage
}