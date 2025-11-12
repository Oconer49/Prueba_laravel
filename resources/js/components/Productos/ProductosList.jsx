import { useState, useEffect } from 'react';
import { productosService } from '../../services/productosService';
import ProductoForm from './ProductoForm';

export default function ProductosList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProducto, setEditingProducto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const data = await productosService.getAll();
            setProductos(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProducto(null);
        setShowModal(true);
    };

    const handleEdit = (producto) => {
        setEditingProducto(producto);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Está seguro de eliminar este producto?')) return;

        try {
            await productosService.delete(id);
            loadProductos();
        } catch (err) {
            alert(err.message || 'Error al eliminar producto');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingProducto(null);
    };

    const handleSave = () => {
        loadProductos();
        handleModalClose();
    };

    if (loading) {
        return <div className="text-center py-8">Cargando productos...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Nuevo Producto
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay productos registrados
                                </td>
                            </tr>
                        ) : (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {producto.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${parseFloat(producto.precio).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {producto.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {producto.categoria?.nombre || 'Sin categoría'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(producto)}
                                            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id)}
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

            <ProductoForm
                isOpen={showModal}
                onClose={handleModalClose}
                producto={editingProducto}
                onSave={handleSave}
            />
        </div>
    );
}
