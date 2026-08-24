import { FETCH_TASKS_FAILURE, FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS } from "../actions/actionTypes";

const initialState = {
    items: [],
    isLoading: false,
    error: "",
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return { ...state, isLoading: true, error: "" };

        case FETCH_TASKS_SUCCESS:
            return { ...state, isLoading: false, items: action.payload ?? [] };

        case FETCH_TASKS_FAILURE:
            // The previous list is kept: wiping it would replace a visible board with an empty one
            // the moment a refresh failed.
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};

export default taskReducer;
