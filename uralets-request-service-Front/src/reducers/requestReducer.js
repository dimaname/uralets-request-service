import {createAction, handleActions} from 'redux-actions';
import shortid from 'shortid';
import moment from 'moment'

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));
export const pupilListSetLoading = createAction('PUPIL_LIST_SET_LOADING', (data) => (data));
export const trainerListSetLoading = createAction('PUPIL_TRAINER_SET_LOADING', (data) => (data));
export const setPupilList = createAction('SET_PUPIL_LIST', (data) => (data));
export const updatePupilInList = createAction('UPDATE_PUPIL_IN_LIST', (data) => (data));
export const updateTrainerInList = createAction('UPDATE_TRAINER_IN_LIST', (data) => (data));
export const deletePupilInList = createAction('DELETE_PUPIL_IN_LIST', (data) => (data));
export const deleteTrainerInList = createAction('DELETE_TRAINER_IN_LIST', (data) => (data));
export const addPupilToList = createAction('ADD_PUPIL_TO_LIST', (data) => (data));
export const addTrainerToList = createAction('ADD_TRAINER_TO_LIST', (data) => (data));
export const setTrainerList = createAction('SET_TRAINER_LIST', (data) => (data));
export const addSelectedPupils = createAction('ADD_SELECTED_PUPILS', (data) => (data));
export const removeFromSelectedPupils = createAction('REMOVE_SELECTED_PUPILS', (data) => (data));
export const removeAllSelectedPupils = createAction('REMOVE_ALL_SELECTED_PUPILS', (data) => (data));
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
            if (Array.isArray(pupilsList)) {
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
            if (Array.isArray(trainersList)) {
                dispatch(setTrainerList(trainersList));
            }
            if (Array.isArray(trainersColumns) && trainersColumns.length) {
                dispatch(setTrainerModel(trainersColumns));
            }
            return responce;
        });
    };
export const addSportsmenItem = (sportsmenData) =>
    (dispatch, s, api) => {
        return api.appApi.addPupilItem(sportsmenData).then((responce) => {
            sportsmenData.id = responce;
            dispatch(addPupilToList(sportsmenData));
            return responce;
        });
    };
export const addTrainerItem = (trainerData) =>
    (dispatch, s, api) => {
        return api.appApi.addTrainerItem(trainerData).then((responce) => {
            trainerData.id = responce;
            dispatch(addTrainerToList(trainerData));
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
export const updateTrainerItem = (trainerData) =>
    (dispatch, s, api) => {
        return api.appApi.updateTrainerItem(trainerData).then((responce) => {
            dispatch(updateTrainerInList(trainerData));
            return responce;
        });
    };
export const deleteSportsmenItem = (sportsmenId) =>
    (dispatch, s, api) => {
        return api.appApi.deletePupilItem(sportsmenId).then((responce) => {
            dispatch(deletePupilInList(sportsmenId));
            return responce;
        });
    };
export const deleteTrainerItem = (trainerId) =>
    (dispatch, s, api) => {
        return api.appApi.deleteTrainerItem(trainerId).then((responce) => {
            dispatch(deleteTrainerInList(trainerId));
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
        const sortedPupilList = action.payload.sort(compareByFio);
        return {
            ...state,
            pupilList: sortedPupilList,
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
        const sortedTrainerList = action.payload.sort(compareByFio);
        return {
            ...state,
            trainerList: sortedTrainerList,
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
        const sortedSelectedPupils = selectedPupils.sort(compareByFio);
        return {
            ...state,
            selectedPupils: sortedSelectedPupils,
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
    [removeAllSelectedPupils.toString()]: (state) => {
        return {
            ...state,
            selectedPupils : [],
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
        const sortedSelectedPupils = selectedPupils.sort(compareByFio);
        return {
            ...state,
            selectedPupils: sortedSelectedPupils,
        };

    },
    [updatePupilInList.toString()]: (state, action) => {
        if (!action.payload) return state;
        const newProps = action.payload;
        const pupilList = getListWithUpdatedItem(state.pupilList, newProps);
        const sortedPupilList = pupilList.sort(compareByFio);
        return {
            ...state,
            pupilList: sortedPupilList,
        };
    },
    [updateTrainerInList.toString()]: (state, action) => {
        if (!action.payload) return state;
        const newProps = action.payload;
        const trainerList = getListWithUpdatedItem(state.trainerList, newProps);
        const sortedTrainerList = trainerList.sort(compareByFio);
        return {
            ...state,
            trainerList: sortedTrainerList,
        };
    },
    [addPupilToList.toString()]: (state, action) => {
        const newItem = action.payload;
        if (!newItem) return state;

        const pupilList = [...state.pupilList, newItem];
        const sortedPupilList = pupilList.sort(compareByFio);
        return {
            ...state,
            pupilList: sortedPupilList,
        };
    },
    [addTrainerToList.toString()]: (state, action) => {
        const newItem = action.payload;
        if (!newItem) return state;

        const trainerList = [...state.trainerList, newItem];
        const sortedTrainerList = trainerList.sort(compareByFio);
        return {
            ...state,
            trainerList: sortedTrainerList,
        };
    },
    [deletePupilInList.toString()]: (state, action) => {
        if (!action.payload) return state;
        const itemId = action.payload;
        const pupilList = getListWithoutItem(state.pupilList, itemId);
        return {
            ...state,
            pupilList,
        };
    },
    [deleteTrainerInList.toString()]: (state, action) => {
        if (!action.payload) return state;
        const itemId = action.payload;
        const trainerList = getListWithoutItem(state.trainerList, itemId);
        return {
            ...state,
            trainerList,
        };
    },

}, initialState);


function compareByFio(itemA, itemB) {
    return itemA.fio.localeCompare(itemB.fio);
}

function getListWithUpdatedItem(list, itemNewProps) {
    const index = list.findIndex(item => item.id === itemNewProps.id);
    if (index === -1) return list;
    const updatedItem = {...list[index], ...itemNewProps};
    return [
        ...list.slice(0, index),
        updatedItem,
        ...list.slice(index + 1)
    ];
}

function getListWithoutItem(list, id) {
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return list;
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
}

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
