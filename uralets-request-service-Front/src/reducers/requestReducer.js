import {createAction, handleActions} from 'redux-actions';

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));


const initialState = {
    isOpenLightboxForAdding: false,
};

const reducer = handleActions({
    [toggleLightbox.toString()]: (state, action) => {

        return {
            ...state, isOpenLightboxForAdding: action.payload,
        };
    },

    }, initialState);  
    
  
export default reducer;
