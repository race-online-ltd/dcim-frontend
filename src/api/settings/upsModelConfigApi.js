import { apiClient } from '../api-config/config';

export const fetchUpsModelConfigs = async () => {
    try {
        const response = await apiClient.get('/ups-model-config');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchUpsModelConfig = async (id) => {
    try {
        const response = await apiClient.get(`/ups-model-config/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createUpsModelConfig = async (data) => {
    try {
        const response = await apiClient.post('/ups-model-config', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUpsModelConfig = async (id, data) => {
    try {
        const response = await apiClient.put(`/ups-model-config/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUpsModelConfig = async (id) => {
    try {
        const response = await apiClient.delete(`/ups-model-config/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
