import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers";

/**
 * thunk lets action creators return a function instead of a plain object, which is what makes
 * fetchTasks able to dispatch REQUEST, then SUCCESS or FAILURE.
 *
 * createStore is deprecated in Redux 5 in favour of Redux Toolkit's configureStore;
 * legacy_createStore is the same function under a name that doesn't warn.
 */
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
