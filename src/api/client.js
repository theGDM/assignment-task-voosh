import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8800';

const client = axios.create({
    baseURL,
    // The API authenticates with an httpOnly access_token cookie. Axios does not send cookies
    // cross-origin unless this is set, so without it every call arrives anonymous and 401s.
    withCredentials: true,
});

/** Drops the local session. The cookie itself is cleared by the server on logout. */
export const clearSession = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
};

// localStorage says "signed in" long after the cookie expires, which would otherwise leave the
// board rendering empty columns and firing failing requests. Treat the server's word as final.
client.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            clearSession();
            if (window.location.pathname !== '/') {
                window.location.replace('/');
            }
        }
        return Promise.reject(error);
    }
);

/** The API reports failures as { success, status, message }. */
export const apiErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;

export default client;
