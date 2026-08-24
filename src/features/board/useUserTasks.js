import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../actions/taskActions";

/**
 * The board's data, read from the store.
 *
 * Components talk to this hook rather than to useSelector/useDispatch directly, so the store's
 * shape stays an implementation detail — BoardPage never reaches into state itself.
 */
export default function useUserTasks(userId) {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.items);
    const isLoading = useSelector((state) => state.tasks.isLoading);
    const error = useSelector((state) => state.tasks.error);

    const refresh = useCallback(() => {
        dispatch(fetchTasks(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { tasks, isLoading, error, refresh };
}
