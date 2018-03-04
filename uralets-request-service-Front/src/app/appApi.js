import axios from 'axios';

const apiUrl = "http://localhost/api.php"


export const appApi = {
    getApp() {
        return axios.get('/app', {baseURL: apiUrl, withCredentials: true});
    },
    loginByUsername(username, password) {
        return axios.post('/', {username, password}, {baseURL: apiUrl, withCredentials: true});
    },
    logout() {
        return axios.get('/logout', {baseURL: apiUrl, withCredentials: true});
    },
    getPupilList() {
        return axios.get('/mens', {baseURL: apiUrl, withCredentials: true}).then(data => {
            return {result: deserialize(data.data.mens), columns: data.data.mens.columns};
        });
    },
    getTrainerList() {
        return axios.get('/trainers', {baseURL: apiUrl, withCredentials: true}).then(data => {
            return {result: deserialize(data.data.trainers), columns: data.data.trainers.columns};
        });
    },
    sendRequestToServer(requestData) {
        return axios.post('/requestBlank', {requestData}, {baseURL: apiUrl, withCredentials: true}).then(responce => {
            const {status, statusMessage} = responce.data;
            if(!status || status === 'error'){
                throw new Error(statusMessage);
            }
            return status;
        });
    },
    addPupilsToList(data = {}){
        return axios.post('/mens',data, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return deserialize(data.data.mens);
        });
    },
};

const deserialize = function ({columns, records}) {

    const result = records.map(record => {
        const newRecord = {};
        record.forEach((field, i) => {
            newRecord[columns[i]] = field;
        });
        return newRecord;
    });
    return result;
}