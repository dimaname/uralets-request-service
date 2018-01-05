import axios from 'axios';

const apiUrl = "http://localhost/get/api.php/"


export const appApi = {
  getTodos() {
    return axios.get('/units', {baseURL:apiUrl});
  },
  getToken(username,password) {
    return axios.post('/', {a:123, username, password}, {baseURL:apiUrl});
  },
 
}
