import {createAction, handleActions} from 'redux-actions';
import shortid from 'shortid';
import moment from 'moment'

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));
export const pupilListSetLoading = createAction('PUPIL_LIST_SET_LOADING', (data) => (data));
export const trainerListSetLoading = createAction('PUPIL_TRAINER_SET_LOADING', (data) => (data));
export const setPupilList = createAction('SET_PUPIL_LIST', (data) => (data));
export const updatePupilInList = createAction('UPDATE_PUPIL_IN_LIST', (data) => (data));
export const setTrainerList = createAction('SET_TRAINER_LIST', (data) => (data));
export const addSelectedPupils = createAction('ADD_SELECTED_PUPILS', (data) => (data));
export const removeFromSelectedPupils = createAction('REMOVE_SELECTED_PUPILS', (data) => (data));
export const updateSelectedPupils = createAction('UPDATE_SELECTED_PUPILS', (data) => (data));
export const setTrainerModel = createAction('SET_TRAINERS_MODEL', (data) => (data));
export const setPupilModel = createAction('SET_PUPIL_MODEL', (data) => (data));
export const setCompetitionTitle = createAction('SET_COMPETITION_TITLE', (data) => (data));

export const getPupilList = () =>
    (dispatch, s, api) => {
        dispatch(pupilListSetLoading(true));
        return api.appApi.getPupilList().then((responce) => {
            dispatch(pupilListSetLoading(false));
            const pupilsList = responce.result;
            const pupilsColumns = responce.columns;
            if (Array.isArray(pupilsList) && pupilsList.length) {
                dispatch(setPupilList(pupilsList));
            }
            if (Array.isArray(pupilsColumns) && pupilsColumns.length) {
                dispatch(setPupilModel(pupilsColumns));
            }
            return responce;
        });
    };
export const getTrainerList = () =>
    (dispatch, s, api) => {
        dispatch(trainerListSetLoading(true));
        return api.appApi.getTrainerList().then((responce) => {
            dispatch(trainerListSetLoading(false));
            const trainersList = responce.result;
            const trainersColumns = responce.columns;
            if (Array.isArray(trainersList) && trainersList.length) {
                dispatch(setTrainerList(trainersList));
            }
            if (Array.isArray(trainersColumns) && trainersColumns.length) {
                dispatch(setTrainerModel(trainersColumns));
            }
            return responce;
        });
    };
export const updateSportsmenItem = (sportsmenData) =>
    (dispatch, s, api) => {
        return api.appApi.updatePupilItem(sportsmenData).then((responce) => {
            dispatch(updatePupilInList(sportsmenData));

            return responce;
        });
    };
export const sendRequestToServer = () =>
    (dispatch, s, api) => {
        const state = s().request;
        const competitionTitle = state.competitionTitle;
        const selectedPupils = state.selectedPupils.map(item => {
            const momemtBirthday = moment(item.birthday);
            const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';
            return {
                fio: item.fio,
                birthday: birthday,
                level: item.level,
                weight: item.weight,
                trainerFio: item.trainer.fio,
            }
        });
        return api.appApi.sendRequestToServer({selectedPupils, competitionTitle});
    };


const initialState = {
    isOpenLightboxForAdding: false,
    isPupilListLoading: false,
    isPupilListReady: false,
    pupilList: [],
    pupilModel: [],
    isTrainerListLoading: false,
    isTrainerListReady: false,
    trainerList: [],
    trainerModel: [],
    selectedPupils: [],
    competitionTitle: '',
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
    [setPupilModel.toString()]: (state, action) => {
        return {
            ...state,
            pupilModel: action.payload,
        };
    },
    [trainerListSetLoading.toString()]: (state, action) => {
        return {
            ...state, isTrainerListLoading: action.payload,
        };
    },
    [setCompetitionTitle.toString()]: (state, action) => {
        return {
            ...state, competitionTitle: action.payload,
        };
    },
    [setTrainerList.toString()]: (state, action) => {
        return {
            ...state,
            trainerList: action.payload,
            isTrainerListReady: true,
        };
    },
    [setTrainerModel.toString()]: (state, action) => {
        return {
            ...state,
            trainerModel: action.payload,
        };
    },
    [addSelectedPupils.toString()]: (state, action) => {
        const newItems = action.payload;
        if (!newItems || !newItems.length) return state;

        newItems.map(item => {
            item.frontId = shortid.generate();
            return item
        });

        const selectedPupils = [...state.selectedPupils, ...newItems];
        return {
            ...state,
            selectedPupils,
        };
    },
    [removeFromSelectedPupils.toString()]: (state, action) => {
        if (action.payload === undefined) return state;
        const index = action.payload;
        const selectedPupils = [
            ...state.selectedPupils.slice(0, index),
            ...state.selectedPupils.slice(index + 1)
        ];
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
    [updatePupilInList.toString()]: (state, action) => {
        if (!action.payload) return state;
        const newProps = action.payload;
        const index = state.pupilList.findIndex( item => item.id === newProps.id);
        debugger;
        if(index === -1) return state;
        const updatedItem = {...state.pupilList[index], ...newProps};
        const pupilList = [
            ...state.pupilList.slice(0, index),
            updatedItem,
            ...state.pupilList.slice(index + 1)
        ];

        return {
            ...state,
            pupilList,
        };

    },

}, initialState);


export default reducer;


export function matchPupilAndTrainer(pupilList = [], treainerList = []) {
        const trainerByIds = treainerList.reduce((result, trainer) => {
            result[trainer.id] = trainer;
            return result;
        }, {});

        return pupilList.map(pupil => {
            const trainerObj = trainerByIds[pupil.trainer] || {};
            return {...pupil, trainer: trainerObj};
        })
}
