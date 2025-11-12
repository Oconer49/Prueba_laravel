import api from './api';

export const categoriasService = {
    getAll: async () => {
        const response = await api.get('/categorias');
        return response.data;
    },
};
