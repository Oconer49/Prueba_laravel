import api from './api';

export const inventarioService = {
    getAll: async () => {
        const response = await api.get('/inventario');
        return response.data;
    },

    updateStock: async (productoId, stock) => {
        const response = await api.put(`/inventario/${productoId}`, { stock });
        return response.data;
    },
};
