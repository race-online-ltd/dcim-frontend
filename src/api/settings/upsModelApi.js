import { apiClient } from '../api-config/config';

export const fetchUpsModels = async () => {
    try {
        const response = await apiClient.get('/ups-models');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchUpsModel = async (id) => {
    try {
        const response = await apiClient.get(`/ups-models/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createUpsModel = async (data) => {
    try {
        const response = await apiClient.post('/ups-models', data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUpsModel = async (id, data) => {
    try {
        const response = await apiClient.put(`/ups-models/${id}`, data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUpsModel = async (id) => {
    try {
        const response = await apiClient.delete(`/ups-models/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
