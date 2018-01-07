import {createAction, handleActions} from 'redux-actions';

export const setUserToken = createAction('SET_USER_TOKEN', (token) => ({token}));

export const getSavedUserToken = () =>
    (dispatch, s, api) => {
        const userToken = localStorage.getItem("userToken");
        if(userToken){
            dispatch(setUserToken(userToken));
        }    
           
    };

export const getUserTokenFromApi = (username, password) =>
    (dispatch, s, api) => {
        
        return api.appApi.getToken(username, password).then((responce)=>{
            const userToken = responce.data;
            debugger;
            dispatch(setUserToken(userToken));
            return userToken;            
        });
         
           
    };

const initialState = {
    token: null,
};

const reducer = handleActions({
        ['SET_USER_TOKEN']: (state, action) => {
            debugger;
            const user = {...state.user, token: action.payload};
            return {
                ...state, user: user,
            };
        },
    }, initialState);

export default reducer;
