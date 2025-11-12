import { useState, useEffect } from 'react';
import { inventarioService } from '../../services/inventarioService';

export default function InventarioList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingStock, setEditingStock] = useState({});

    useEffect(() => {
        loadInventario();
    }, []);

    const loadInventario = async () => {
        try {
            setLoading(true);
            const data = await inventarioService.getAll();
            setProductos(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al cargar inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleEditStock = (producto) => {
        setEditingStock({
            ...editingStock,
            [producto.id]: producto.stock.toString(),
        });
    };

    const handleStockChange = (productoId, value) => {
        setEditingStock({
            ...editingStock,
            [productoId]: value,
        });
    };

    const handleSaveStock = async (producto) => {
        const newStock = parseInt(editingStock[producto.id]);
        
        if (isNaN(newStock) || newStock < 0) {
            alert('El stock debe ser un número mayor o igual a 0');
            return;
        }

        try {
            await inventarioService.updateStock(producto.id, newStock);
            const updated = { ...editingStock };
            delete updated[producto.id];
            setEditingStock(updated);
            loadInventario();
        } catch (err) {
            alert(err.message || 'Error al actualizar stock');
        }
    };

    const handleCancelEdit = (productoId) => {
        const updated = { ...editingStock };
        delete updated[productoId];
        setEditingStock(updated);
    };

    if (loading) {
        return <div className="text-center py-8">Cargando inventario...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
                <p className="text-gray-600 mt-2">Gestione el stock de productos</p>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay productos en el inventario
                                </td>
                            </tr>
                        ) : (
                            productos.map((producto) => {
                                const isEditing = editingStock.hasOwnProperty(producto.id);
                                
                                return (
                                    <tr key={producto.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {producto.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {producto.categoria?.nombre || 'Sin categoría'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${parseFloat(producto.precio).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editingStock[producto.id]}
                                                    onChange={(e) => handleStockChange(producto.id, e.target.value)}
                                                    className="w-24 px-2 py-1 border rounded"
                                                />
                                            ) : (
                                                <span className={producto.stock === 0 ? 'text-red-600 font-semibold' : ''}>
                                                    {producto.stock}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveStock(producto)}
                                                        className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelEdit(producto.id)}
                                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditStock(producto)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                >
                                                    Ajustar Stock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
