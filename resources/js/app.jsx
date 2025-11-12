import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductosList from './components/Productos/ProductosList';
import ClientesList from './components/Clientes/ClientesList';
import PedidosList from './components/Pedidos/PedidosList';

function Navigation() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinkClass = (path) => {
        return `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
        }`;
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-gray-900">
                            Sistema de Gestión
                        </Link>
                        <div className="flex space-x-4">
                            <Link to="/productos" className={navLinkClass('/productos')}>
                                Productos
                            </Link>
                            <Link to="/clientes" className={navLinkClass('/clientes')}>
                                Clientes
                            </Link>
                            <Link to="/pedidos" className={navLinkClass('/pedidos')}>
                                Pedidos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <Routes>
                    <Route path="/" element={<ProductosList />} />
                    <Route path="/productos" element={<ProductosList />} />
                    <Route path="/clientes" element={<ClientesList />} />
                    <Route path="/pedidos" element={<PedidosList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
