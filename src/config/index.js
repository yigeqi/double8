const config = {
  development: {
    baseURL:'http://127.0.0.1:8080',
    path: {
      login:'/login',
      logout:'/logout',
      register:'/register'
    }
  },
  production: {
    baseURL:'http://127.0.0.1:8080',
    path: {
      login:'/login',
      logout:'/logout',
      register:'/register'
    }
  }
}
export default config[process.env.NODE_ENV]
