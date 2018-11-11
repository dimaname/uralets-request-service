import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import './index.css';
import App from './app/App';
import {initStore} from './app/initStore';
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
    LogRocket.init('fy0v4n/service-x', {
        shouldCaptureIP: false,
    });
}
const store = initStore();


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

 