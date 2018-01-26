import {createAction, handleActions} from 'redux-actions';

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));
export const pupilListSetLoading = createAction('PUPIL_LIST_SET_LOADING', (data) => (data));
export const trainerListSetLoading = createAction('PUPIL_TRAINER_SET_LOADING', (data) => (data));
export const setPupilList = createAction('SET_PUPIL_LIST', (data) => (data));
export const setTrainerList = createAction('SET_TRAINER_LIST', (data) => (data));
export const addSelectedPupils = createAction('ADD_SELECTED_PUPILS', (data) => (data));
export const updateSelectedPupils = createAction('UPDATE_SELECTED_PUPILS', (data) => (data));

export const getPupilList = () =>
    (dispatch, s, api) => {
        dispatch(pupilListSetLoading(true));
        return api.appApi.getPupilList().then((responce) => {
            dispatch(pupilListSetLoading(false));
            if (Array.isArray(responce) && responce.length) {
                dispatch(setPupilList(responce));
            }
            return responce;
        });
    };
export const getTrainerList = () =>
    (dispatch, s, api) => {
        dispatch(trainerListSetLoading(true));
        return api.appApi.getTrainerList().then((responce) => {
            dispatch(trainerListSetLoading(false));
            if (Array.isArray(responce) && responce.length) {
                dispatch(setTrainerList(responce));
            }
            return responce;
        });
    };


const initialState = {
    isOpenLightboxForAdding: false,
    isPupilListLoading: false,
    isPupilListReady: false,
    pupilList: [],
    isTrainerListLoading: false,
    isTrainerListReady: false,
    trainerList: [],
    selectedPupils: [],
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
            ...state,
            pupilList: action.payload,
            isPupilListReady: true,
        };
    },
    [trainerListSetLoading.toString()]: (state, action) => {
        return {
            ...state, isTrainerListLoading: action.payload,
        };
    },
    [setTrainerList.toString()]: (state, action) => {
        return {
            ...state,
            trainerList: action.payload,
            isTrainerListReady: true,
        };
    },
    [addSelectedPupils.toString()]: (state, action) => {
        if (!action.payload) return state;

        const selectedPupils = [...state.selectedPupils, ...action.payload];
        return {
            ...state,
            selectedPupils,
        };
    },
    [updateSelectedPupils.toString()]: (state, action) => {
        if (!action.payload) return state;
        const index = action.payload.index;
        const props = action.payload.props;
        const updatedItem = {...state.selectedPupils[index], ...props};
        const selectedPupils = [
            ...state.selectedPupils.slice(0, index),
            updatedItem,
            ...state.selectedPupils.slice(index + 1)
        ];

        return {
            ...state,
            selectedPupils,
        };

    },

}, initialState);


export default reducer;
