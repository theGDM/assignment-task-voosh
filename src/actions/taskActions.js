import { FETCH_TASKS_FAILURE, FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS } from "./actionTypes";
import { listTasks } from "../api/tasks";
import { apiErrorMessage } from "../api/client";

// ---------------------------------------------------------------- action creators

export const fetchTasksRequest = () => ({
    type: FETCH_TASKS_REQUEST,
});

export const fetchTasksSuccess = (tasks) => ({
    type: FETCH_TASKS_SUCCESS,
    payload: tasks,
});

export const fetchTasksFailure = (message) => ({
    type: FETCH_TASKS_FAILURE,
    payload: message,
});

// ---------------------------------------------------------------- thunk

/**
 * Loads the signed-in user's tasks.
 *
 * A failure dispatches FAILURE with the server's message. The version this replaces retried three
 * times in silence and then dispatched success with an empty array, so a broken API looked
 * identical to an empty board.
 */
export const fetchTasks = (userId) => async (dispatch) => {
    if (!userId) return;

    dispatch(fetchTasksRequest());
    try {
        dispatch(fetchTasksSuccess(await listTasks(userId)));
    } catch (err) {
        dispatch(fetchTasksFailure(apiErrorMessage(err, "Couldn't load your tasks.")));
    }
};
