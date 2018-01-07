import axios from 'axios';

const apiUrl = "http://localhost/api.php"


export const appApi = {
  getApp() {
    return axios.get('/app', {baseURL:apiUrl});
  },
  loginByUsername(username,password) {
    return axios.post('/', {username, password}, {baseURL:apiUrl});
  },
 
}