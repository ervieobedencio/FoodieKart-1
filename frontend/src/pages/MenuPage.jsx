import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            // Show only available products to customers
            setProducts(data.filter(p => p.is_available));
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Loading Menu...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Our Menu</h1>
            <p className="text-gray-500 mb-8">Authentic Filipino flavors, delivered hot to your table.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.product_id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group">
                        <div className="h-48 bg-gradient-to-br from-orange-100 via-red-50 to-rose-100 relative overflow-hidden flex items-center justify-center p-6">
                            {/* Decorative blur circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 blur-2xl rounded-full"></div>
                            {/* Placeholder for actual food images */}
                            <span className="text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10" role="img" aria-label="Food">🍲</span>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm h-10 line-clamp-2 mb-6">{product.description}</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                                <span className="text-primary-700 font-black text-2xl tracking-tight">₱{Number(product.price).toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No products currently available. Check back soon!
                    </div>
                )}
            </div>
        </div>
    );
}
