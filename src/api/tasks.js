import client from './client';

export const listTasks = async (userId) => {
    const { data } = await client.get(`/api/tasks/${userId}/task`);
    return data ?? [];
};

export const createTask = async (userId, { title, description, taskDeadline }) => {
    const { data } = await client.post(`/api/tasks/${userId}`, { title, description, taskDeadline });
    return data;
};

export const updateTask = async (taskId, changes) => {
    const { data } = await client.put(`/api/tasks/${taskId}`, changes);
    return data;
};

export const deleteTask = async (taskId) => {
    await client.delete(`/api/tasks/${taskId}`);
};
