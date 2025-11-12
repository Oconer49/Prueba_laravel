import { useState, useEffect } from 'react';
import { clientesService } from '../../services/clientesService';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';

export default function ClienteForm({ isOpen, onClose, cliente, onSave }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (cliente) {
                setFormData({
                    nombre: cliente.nombre || '',
                    email: cliente.email || '',
                    telefono: cliente.telefono || '',
                });
            } else {
                setFormData({
                    nombre: '',
                    email: '',
                    telefono: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, cliente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const data = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono || null,
            };

            // console.log('Guardando cliente:', data);
            if (cliente) {
                // console.log('Actualizando cliente existente');
                await clientesService.update(cliente.id, data);
            } else {
                // console.log('Creando nuevo cliente');
                await clientesService.create(data);
            }

            onSave();
        } catch (err) {
            // console.error('Error al guardar cliente:', err);
            // alert('Error al guardar cliete'); // typo
            alert(err.message || 'Error al guardar cliente');
        } finally {
            setLoading(false);
        }
    };

    const formId = cliente ? `cliente-form-${cliente.id}` : 'cliente-form';

    return (
        <Modal
            isOpen={isOpen}
            title={cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form={formId}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            }
        >
            <form id={formId} onSubmit={handleSubmit}>
                <FormField label="Nombre" htmlFor="nombre" error={errors.nombre}>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                </FormField>

                <FormField label="Email" htmlFor="email" error={errors.email}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                </FormField>

                <FormField label="Teléfono" htmlFor="telefono" error={errors.telefono}>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.telefono ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                </FormField>
            </form>
        </Modal>
    );
}
