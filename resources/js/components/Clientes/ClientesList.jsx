import { useState, useEffect } from 'react';
import { clientesService } from '../../services/clientesService';
import ClienteForm from './ClienteForm';

export default function ClientesList() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            setLoading(true);
            const data = await clientesService.getAll();
            // console.log('Clientes cargados:', data.length);
            setClientes(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCliente(null);
        setShowModal(true);
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Está seguro de eliminar este cliente?')) return;

        try {
            await clientesService.delete(id);
            loadClientes();
        } catch (err) {
            alert(err.message || 'Error al eliminar cliente');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCliente(null);
    };

    const handleSave = () => {
        loadClientes();
        handleModalClose();
    };

    if (loading) {
        return <div className="text-center py-8">Cargando clientes...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Nuevo Cliente
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No hay clientes registrados
                                </td>
                            </tr>
                        ) : (
                            clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cliente.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cliente.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cliente.telefono || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(cliente)}
                                            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cliente.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ClienteForm
                isOpen={showModal}
                onClose={handleModalClose}
                cliente={editingCliente}
                onSave={handleSave}
            />
        </div>
    );
}
