import { CLEAR_USER, SET_USER } from "./actionTypes";

/** Records the signed-in account after a successful login. */
export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

/** Forgets it on logout. */
export const clearUser = () => ({
    type: CLEAR_USER,
});
