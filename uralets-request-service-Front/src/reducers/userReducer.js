import {createAction, handleActions} from 'redux-actions';

export const setUser = createAction('SET_USER', (userData) => (userData));
export const clearUser = createAction('CLEAR_USER');


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

export const logout = () =>
    (dispatch, s, api) => {        
        return api.appApi.logout().then(()=>{
            dispatch(clearUser());                      
            return true;            
        });
    };

const initialState = {
    id: null,
    username: null,
};

const reducer = handleActions({
    [setUser.toString()]: (state, action) => {
        const userData = action.payload;
     
        return {
            ...state, id:userData.id, username: userData.username,
        };
    },
    [clearUser.toString()]: (state, action) => {
        return {
            ...state, id:null, username: null,
        };
    }
    }, initialState);  
    
  
export default reducer;
