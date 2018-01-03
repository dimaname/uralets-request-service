import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux'
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import {initStore} from './app/initStore';
import { HashRouter } from 'react-router-dom'

const store = initStore();


registerServiceWorker();

ReactDOM.render( 
	<Provider store={store}>
		<HashRouter>
			<App /> 
		</HashRouter>
	</Provider>,
	 document.getElementById('root'));
registerServiceWorker();
 