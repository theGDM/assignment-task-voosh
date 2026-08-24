import { CLEAR_USER, SET_USER } from "../actions/actionTypes";

/**
 * Redux state does not survive a page refresh, so the store is seeded from localStorage — which
 * is what actually persists the session alongside the httpOnly cookie. Without this, reloading
 * the board would leave the header with no name to show even though you are still signed in.
 */
const storedUser = () => {
    const id = localStorage.getItem("userId");
    if (!id) return null;

    return {
        id,
        email: localStorage.getItem("userEmail"),
        fullName: localStorage.getItem("userName") || "",
    };
};

const initialState = {
    current: storedUser(),
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, current: action.payload };

        case CLEAR_USER:
            return { ...state, current: null };

        default:
            return state;
    }
};

export default userReducer;
