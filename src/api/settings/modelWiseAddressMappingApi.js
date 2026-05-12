import { apiClient } from '../api-config/config';

export const fetchModelWiseAddressMappings = async () => {
    try {
        const response = await apiClient.get('/model-wise-address-mappings');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchModelWiseAddressMapping = async (id) => {
    try {
        const response = await apiClient.get(`/model-wise-address-mappings/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createModelWiseAddressMapping = async (data) => {
    try {
        const response = await apiClient.post('/model-wise-address-mappings', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateModelWiseAddressMapping = async (id, data) => {
    try {
        const response = await apiClient.put(`/model-wise-address-mappings/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteModelWiseAddressMapping = async (id) => {
    try {
        const response = await apiClient.delete(`/model-wise-address-mappings/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
