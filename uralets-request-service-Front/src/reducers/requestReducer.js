import {createAction, handleActions} from 'redux-actions';

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));
export const pupilListSetLoading = createAction('PUPIL_LIST_SET_LOADING', (data) => (data));
export const setPupilList = createAction('SET_PUPIL_LIST', (data) => (data));

export const getPupilList = () =>
    (dispatch, s, api) => {
        dispatch(pupilListSetLoading(true));
        return api.appApi.getPupilList().then((responce)=>{
            dispatch(pupilListSetLoading(false));
            if(Array.isArray(responce) && responce.length ){
                dispatch(setPupilList(responce));
            }
            return responce;
        });
    };



const initialState = {
    isOpenLightboxForAdding: false,
    isPupilListLoading: false,
    pupilList: [],
};


const reducer = handleActions({
    [toggleLightbox.toString()]: (state, action) => {
        return {
            ...state, isOpenLightboxForAdding: action.payload,
        };
    },
    [pupilListSetLoading.toString()]: (state, action) => {
        return {
            ...state, isPupilListLoading: action.payload,
        };
    },
    [setPupilList.toString()]: (state, action) => {
        return {
            ...state, pupilList: action.payload,
        };
    },

    }, initialState);  
    
  
export default reducer;
