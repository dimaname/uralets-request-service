import axios from 'axios';

const apiUrl = "http://localhost/api.php"


export const appApi = {
  getApp() {
    return axios.get('/app', {baseURL:apiUrl, withCredentials: true});
  },
  loginByUsername(username,password) {
    return axios.post('/', {username, password}, {baseURL:apiUrl, withCredentials: true});
  },
  logout() {
    return axios.get('/logout', {baseURL:apiUrl, withCredentials: true});
  },
}