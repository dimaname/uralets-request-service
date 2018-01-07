import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './app/App';
import {initStore} from './app/initStore';
import { HashRouter } from 'react-router-dom'

const store = initStore();



ReactDOM.render( 
	<Provider store={store}>
		<HashRouter>
			<App /> 
		</HashRouter>
	</Provider>,
	 document.getElementById('root'));

 