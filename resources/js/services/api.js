import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.message || 'Error en la solicitud';
            return Promise.reject(new Error(message));
        } else if (error.request) {
            return Promise.reject(new Error('No se pudo conectar con el servidor'));
        } else {
            return Promise.reject(error);
        }
    }
);

export default api;
