import {combineReducers} from 'redux';

import userReducer from '../reducers/userReducer';
import appReducer from '../reducers/appReducer';
import requestReducer from '../reducers/requestReducer';


export const reducers = combineReducers({
    app: appReducer,
    user: userReducer,
    request: requestReducer,
});
