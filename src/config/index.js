const config = {
  dev: {
    baseURL:'http://192.168.27.99:8080',
    path: {
      login:'/login',
      logout:'/logout',
      register:'/register'
    }
  },
  prod: {

  }
}

export default config['dev']