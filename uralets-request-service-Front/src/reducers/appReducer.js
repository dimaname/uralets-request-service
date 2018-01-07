import {createAction, handleActions} from 'redux-actions';
import { setUser } from '../reducers/userReducer'


export const getApp = () =>
    (dispatch, s, api) => {        
        return api.appApi.getApp().then((responce)=>{
            const appData = responce.data;
            if(appData.user !== null){
                dispatch(setUser(appData.user));
            } 
            return appData;           
        });          
    };


const initialState = {};

const reducer = handleActions({}, 
    initialState);

export default reducer;
