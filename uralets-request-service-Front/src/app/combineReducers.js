import {combineReducers} from 'redux';

//import todoReducer, {todoState} from '../reducers/todoReducer';

export const initialState = {
	user: {
		token: null,
	}
};

export const reducers = combineReducers({
   // todoList: todoReducer,
});
