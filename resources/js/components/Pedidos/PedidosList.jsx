import { useState, useEffect } from 'react';
import { pedidosService } from '../../services/pedidosService';
import PedidoForm from './PedidoForm';
import PedidoDetail from './PedidoDetail';

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidosService.getAll();
            setPedidos(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setShowModal(true);
    };

    const handleViewDetail = async (pedido) => {
        try {
            const data = await pedidosService.getById(pedido.id);
            setSelectedPedido(data);
            setShowDetail(true);
        } catch (err) {
            alert(err.message || 'Error al cargar detalle del pedido');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleDetailClose = () => {
        setShowDetail(false);
        setSelectedPedido(null);
    };

    const handleSave = () => {
        loadPedidos();
        handleModalClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    if (loading) {
        return <div className="text-center py-8">Cargando pedidos...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Nuevo Pedido
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay pedidos registrados
                                </td>
                            </tr>
                        ) : (
                            pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{pedido.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {pedido.cliente?.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(pedido.fecha)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ${parseFloat(pedido.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetail(pedido)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PedidoForm
                isOpen={showModal}
                onClose={handleModalClose}
                onSave={handleSave}
            />

            <PedidoDetail
                isOpen={showDetail}
                onClose={handleDetailClose}
                pedido={selectedPedido}
            />
        </div>
    );
}
