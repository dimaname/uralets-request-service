import {combineReducers} from 'redux';

import userReducer from '../reducers/userReducer';
import appReducer from '../reducers/appReducer';


export const reducers = combineReducers({
    user: userReducer,
    app: appReducer,
});
