const config = {
  development: {
    baseURL:'http://192.168.27.99:8080',
    path: {
      login:'/login',
      logout:'/logout',
      register:'/register'
    }
  },
  production: {
    baseURL:'http://192.168.27.99:8080',
    path: {
      login:'/login',
      logout:'/logout',
      register:'/register'
    }
  }
}
export default config[process.env.NODE_ENV]
