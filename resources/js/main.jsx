import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../css/app.css';

const appElement = document.getElementById('app');

if (appElement) {
    createRoot(appElement).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
} else {
    console.error('Elemento #app no encontrado en el DOM');
}
