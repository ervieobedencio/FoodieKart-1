import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to={isAdmin ? '/admin' : '/menu'} className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
                            FoodieKart 🍔
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="btn-primary py-1.5 text-sm">Sign Up</Link>
                            </>
                        ) : isAdmin ? (
                            <>
                                <Link to="/admin/orders" className="text-gray-700 hover:text-primary-600 font-medium">Queue</Link>
                                <Link to="/admin/menu" className="text-gray-700 hover:text-primary-600 font-medium">Menu Mgt</Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-600 font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/menu" className="text-gray-700 hover:text-primary-600 font-medium">Menu</Link>
                                <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium">History</Link>
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 font-medium flex items-center">
                                    <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-600 font-medium ml-4">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
