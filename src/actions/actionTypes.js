/**
 * Action type constants.
 *
 * Kept in one module so the action creator and the reducer can't drift apart — a mistyped string
 * in either place fails silently, which is the classic hazard of this structure.
 */
export const FETCH_TASKS_REQUEST = "FETCH_TASKS_REQUEST";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILURE = "FETCH_TASKS_FAILURE";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
