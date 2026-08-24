import { combineReducers } from "redux";
import taskReducer from "./taskReducer";
import userReducer from "./userReducer";

/** Every slice of application state, assembled in one place. */
const rootReducer = combineReducers({
    user: userReducer,
    tasks: taskReducer,
});

export default rootReducer;
