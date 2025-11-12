import { useState, useEffect } from 'react';
import { productosService } from '../../services/productosService';
import { categoriasService } from '../../services/categoriasService';

export default function ProductoForm({ isOpen, onClose, producto, onSave }) {
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        stock: '',
        categoria_id: '',
    });
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategorias();
            if (producto) {
                setFormData({
                    nombre: producto.nombre || '',
                    precio: producto.precio || '',
                    stock: producto.stock || '',
                    categoria_id: producto.categoria_id || '',
                });
            } else {
                setFormData({
                    nombre: '',
                    precio: '',
                    stock: '',
                    categoria_id: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, producto]);

    const loadCategorias = async () => {
        try {
            const data = await categoriasService.getAll();
            // console.log('Categorías cargadas:', data);
            setCategorias(data);
        } catch (err) {
            // console.error('Error al cargar categorías:', err);
            console.error('Error al cargar categorías:', err);
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

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        const precio = parseFloat(formData.precio);
        if (!formData.precio || precio < 0) {
            newErrors.precio = 'El precio debe ser mayor o igual a 0';
        }

        const stock = parseInt(formData.stock);
        if (formData.stock === '' || stock < 0) {
            newErrors.stock = 'El stock debe ser mayor o igual a 0';
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
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                categoria_id: formData.categoria_id || null,
            };

            // console.log('Guardando producto:', data);
            if (producto) {
                // console.log('Actualizando producto existente');
                await productosService.update(producto.id, data);
            } else {
                // console.log('Creando nuevo producto');
                await productosService.create(data);
            }

            onSave();
        } catch (err) {
            // console.error('Error al guardar:', err);
            // alert('Error al guardar prodcto'); // typo
            alert(err.message || 'Error al guardar producto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // TODO: considerar usar el componente Modal reutilizable
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 z-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Cerrar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
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
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    step="0.01"
                                    min="0"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.precio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.precio && (
                                    <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.stock ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría
                                </label>
                                <select
                                    id="categoria_id"
                                    name="categoria_id"
                                    value={formData.categoria_id}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.categoria_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoria_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
