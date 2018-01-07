import {createAction, handleActions} from 'redux-actions';

export const setUser = createAction('SET_USER', (userData) => (userData));


export const loginByUsername = (username, password) =>
    (dispatch, s, api) => {        
        return api.appApi.loginByUsername(username, password).then((responce)=>{
            const userData = responce.data;
       
            if(userData && userData.type !== 'error'){
                dispatch(setUser(userData));               
            }           
            return userData;            
        });
    };

const initialState = {
    id: null,
    username: null,
};

const reducer = handleActions({
    ['SET_USER']: (state, action) => {
        const userData = action.payload;
     
        return {
            ...state, id:userData.id, username: userData.username,
        };
    }}, initialState);

export default reducer;
