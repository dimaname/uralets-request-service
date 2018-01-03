import axios from 'axios';

const apiUrl = "localhost/api.php"
export const appApi = {
  getTodos() {
    return axios.get(apiUrl+'/units');
  },
 
}
