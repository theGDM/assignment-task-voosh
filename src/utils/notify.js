import { toast } from "react-toastify";

/**
 * Every notification is either "that worked" or "that didn't".
 *
 * Call sites used the bare `toast()` default, which renders with no icon and no colour — so a
 * failed delete looked exactly like a successful one.
 */
export const notifySuccess = (message) => toast.success(message);

export const notifyError = (message) => toast.error(message);
