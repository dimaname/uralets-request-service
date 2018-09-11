import axios from 'axios';

const apiUrl = "http://localhost/servicex/api.php"


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
            if(!data.data.mens) throw 'error';
            return {result: deserialize(data.data.mens), columns: data.data.mens.columns};
        });
    },
    getTrainerList() {
        return axios.get('/trainers', {baseURL: apiUrl, withCredentials: true}).then(data => {
            if(!data.data.trainers) throw 'error';
            return {result: deserialize(data.data.trainers), columns: data.data.trainers.columns};
        });
    },
    sendRequestToServer(requestData) {
        return axios.post('/requestBlank', {requestData}, {baseURL: apiUrl, withCredentials: true}).then(responce => {
            const {status, statusMessage} = responce.data;
            if (!status || status === 'error') {
                throw new Error(statusMessage);
            }
            return status;
        });
    },
    addPupilItem(data = {}) {
        return axios.post('/mens/', data, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
        });
    },
    addTrainerItem(data = {}) {
        return axios.post('/trainers/', data, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
        });
    },
    updatePupilItem(data = {}) {
        const id = data.id;
        return axios.put('/mens/' + id, data, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
        });
    },
    updateTrainerItem(data = {}) {
        const id = data.id;
        return axios.put('/trainers/' + id, data, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
        });
    },
    deletePupilItem(id) {
        return axios.delete('/mens/' + id, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
        });
    },
    deleteTrainerItem(id) {
        return axios.delete('/trainers/' + id, {baseURL: apiUrl, withCredentials: true}).then(data => {
            return data.data;
        }).catch(error => {
            throw error;
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
};