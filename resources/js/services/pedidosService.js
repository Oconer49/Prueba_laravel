import api from './api';

export const pedidosService = {
    getAll: async () => {
        const response = await api.get('/pedidos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/pedidos', data);
        return response.data;
    },
};
