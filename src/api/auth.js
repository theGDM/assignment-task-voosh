import client from './client';

// register and login answer with HTTP 200 and { success: false, message } on a rejected attempt,
// so callers must check `success` rather than assume a 2xx means it worked.

export const register = async (fullName, email, password) => {
    const { data } = await client.post('/api/auth/register', { fullName, email, password });
    return data;
};

export const signIn = async (email, password) => {
    const { data } = await client.post('/api/auth/login', { email, password });
    return data;
};

export const signOut = async () => {
    await client.post('/api/auth/logout');
};
