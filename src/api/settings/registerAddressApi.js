import { apiClient } from '../api-config/config';

export const fetchRegisterAddresses = async () => {
    try {
        const response = await apiClient.get('/register-addresses');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchRegisterAddress = async (id) => {
    try {
        const response = await apiClient.get(`/register-addresses/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createRegisterAddress = async (data) => {
    try {
        const response = await apiClient.post('/register-addresses', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateRegisterAddress = async (id, data) => {
    try {
        const response = await apiClient.put(`/register-addresses/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteRegisterAddress = async (id) => {
    try {
        const response = await apiClient.delete(`/register-addresses/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
