import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './app/App';
import {initStore} from './app/initStore';

const store = initStore();



ReactDOM.render( 
	<Provider store={store}>		
		<App /> 		
	</Provider>,
	 document.getElementById('root'));

 