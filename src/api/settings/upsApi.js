import { apiClient } from '../api-config/config';

export const fetchUpsList = async () => {
    try {
        const response = await apiClient.get('/ups');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchUps = async (id) => {
    try {
        const response = await apiClient.get(`/ups/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createUps = async (data) => {
    try {
        const response = await apiClient.post('/ups', data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUps = async (id, data) => {
    try {
        const response = await apiClient.put(`/ups/${id}`, data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUps = async (id) => {
    try {
        const response = await apiClient.delete(`/ups/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
