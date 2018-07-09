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
    isAdmin: null,
};

const reducer = handleActions({
    [setUser.toString()]: (state, action) => {
        const userData = action.payload;
        if(!userData) return state;
        return {
            ...state, ...userData,
        };
    },
    [clearUser.toString()]: (state) => {
        return {
            ...state, id:null, username: null, isAdmin: null,
        };
    }
    }, initialState);  
    
  
export default reducer;
