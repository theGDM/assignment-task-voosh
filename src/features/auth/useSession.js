import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../../actions/userActions";
import { clearSession } from "../../api/client";
import { signOut } from "../../api/auth";

/**
 * The signed-in account, and the two transitions around it.
 *
 * Login and Register used to each write the same three localStorage keys by hand, and the header
 * read them back directly. Both sides go through here now, so the store and localStorage can't
 * disagree about who is signed in.
 */
export default function useSession() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.current);

    const startSession = useCallback((account) => {
        // localStorage is what survives a refresh; the store is what the UI reads.
        localStorage.setItem("userEmail", account.email);
        localStorage.setItem("userId", account.id);
        localStorage.setItem("userName", account.fullName ?? "");
        dispatch(setUser(account));
    }, [dispatch]);

    const endSession = useCallback(async () => {
        try {
            // Clearing localStorage alone left the httpOnly cookie valid for another 7 days;
            // only the server can expire it.
            await signOut();
        } catch (err) {
            console.log(err);
        }
        clearSession();
        dispatch(clearUser());
    }, [dispatch]);

    return { user, startSession, endSession };
}
