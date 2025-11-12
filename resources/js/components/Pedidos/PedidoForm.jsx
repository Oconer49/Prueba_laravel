import { useState, useEffect } from 'react';
import { pedidosService } from '../../services/pedidosService';
import { clientesService } from '../../services/clientesService';
import { productosService } from '../../services/productosService';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';

export default function PedidoForm({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        cliente_id: '',
        fecha: new Date().toISOString().split('T')[0],
    });
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState({ producto_id: '', cantidad: 1 });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadClientes();
            loadProductos();
            setFormData({
                cliente_id: '',
                fecha: new Date().toISOString().split('T')[0],
            });
            setProductos([]);
            setSelectedProducto({ producto_id: '', cantidad: 1 });
            setErrors({});
        }
    }, [isOpen]);

    const loadClientes = async () => {
        try {
            const data = await clientesService.getAll();
            // console.log('Clientes disponibles:', data.length);
            setClientes(data);
        } catch (err) {
            // console.error('Error al obtener clientes:', err);
            console.error('Error al cargar clientes:', err);
        }
    };

    const loadProductos = async () => {
        try {
            const data = await productosService.getAll();
            // console.log('Productos disponibles:', data.length);
            setProductosDisponibles(data);
        } catch (err) {
            // console.error('Error al obtener productos:', err);
            console.error('Error al cargar productos:', err);
        }
    };

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

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setSelectedProducto(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddProducto = () => {
        if (!selectedProducto.producto_id || !selectedProducto.cantidad || selectedProducto.cantidad < 1) {
            alert('Seleccione un producto y una cantidad válida');
            return;
        }

        const prod = productosDisponibles.find(p => p.id === parseInt(selectedProducto.producto_id));
        if (!prod) return;

        if (prod.stock < selectedProducto.cantidad) {
            alert(`Stock insufciente. Stock disponiblle: ${prod.stock}`);
            return;
        }

        if (productos.find(p => p.producto_id === selectedProducto.producto_id)) {
            // console.log('Producto ya agregado');
            alert('Este producto ya está en el pedido');
            return;
        }

        // console.log('Agregando producto al pedido:', prod.nombre);
        setProductos(prev => [...prev, {
            producto_id: parseInt(selectedProducto.producto_id),
            cantidad: parseInt(selectedProducto.cantidad),
            producto: prod,
        }]);

        setSelectedProducto({ producto_id: '', cantidad: 1 });
    };

    const handleRemoveProducto = (index) => {
        setProductos(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.cliente_id) {
            newErrors.cliente_id = 'Debe seleccionar un cliente';
        }

        if (!formData.fecha) {
            newErrors.fecha = 'La fecha es obligatoria';
        }

        if (productos.length === 0) {
            alert('Debe agregar al menos un producto al pedido');
            return false;
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
                cliente_id: parseInt(formData.cliente_id),
                fecha: formData.fecha,
                productos: productos.map(p => ({
                    producto_id: p.producto_id,
                    cantidad: p.cantidad,
                })),
            };

            // console.log('Creando pedido con datos:', data);
            await pedidosService.create(data);
            // console.log('Pedido creado exitosamente');
            onSave();
        } catch (err) {
            // console.error('Error al crear pedido:', err);
            // alert('Error al crear peddido'); // typo
            alert(err.message || 'Error al crear pedido');
        } finally {
            setLoading(false);
        }
    };

    const getTotal = () => {
        const total = productos.reduce((sum, p) => {
            return sum + (parseFloat(p.producto.precio) * p.cantidad);
        }, 0);
        // console.log('Total calculado:', total);
        return total;
    };

    const formId = 'pedido-form';

    return (
        <Modal
            isOpen={isOpen}
            title="Nuevo Pedido"
            onClose={onClose}
            size="lg"
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
                        disabled={loading || productos.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Crear Pedido'}
                    </button>
                </div>
            }
        >
            <form id={formId} onSubmit={handleSubmit}>
                <FormField label="Cliente" htmlFor="cliente_id" error={errors.cliente_id}>
                    <select
                        id="cliente_id"
                        name="cliente_id"
                        value={formData.cliente_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.cliente_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Fecha" htmlFor="fecha" error={errors.fecha}>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.fecha ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                </FormField>

                <FormField label="Agregar Productos" className="mb-6">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                            name="producto_id"
                            value={selectedProducto.producto_id}
                            onChange={handleProductoChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Seleccionar...</option>
                            {productosDisponibles
                                .filter(p => p.stock > 0 && !productos.find(prod => prod.producto_id === p.id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} (Stock: {p.stock})
                                    </option>
                                ))}
                        </select>
                        <input
                            type="number"
                            name="cantidad"
                            min="1"
                            value={selectedProducto.cantidad}
                            onChange={handleProductoChange}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddProducto}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Agregar
                        </button>
                    </div>
                </FormField>

                {productos.length > 0 && (
                    <div className="mb-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productos.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.producto.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.cantidad}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${parseFloat(item.producto.precio).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                ${(parseFloat(item.producto.precio) * item.cantidad).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProducto(index)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <span className="text-lg font-bold text-gray-900">
                                Total: ${getTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}
