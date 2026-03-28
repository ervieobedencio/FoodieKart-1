import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const formattedItems = cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            await api.post('/orders', { items: formattedItems });
            clearCart();
            navigate('/orders', { state: { successMessage: 'Order placed successfully!' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-3xl mx-auto py-24 text-center">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
                <p className="text-lg text-gray-500 mb-10">Looks like you haven't added any delicious food yet.</p>
                <button onClick={() => navigate('/menu')} className="btn-primary text-xl px-10 py-4 shadow-[0_8px_30px_rgb(225,29,72,0.4)] hover:shadow-[0_12px_40px_rgb(225,29,72,0.3)]">
                    Browse Our Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-10 tracking-tight">Review Your Order</h1>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-5">
                    {cart.map(item => (
                        <div key={item.product_id} className="glass-panel rounded-2xl p-5 flex items-center justify-between hover:border-gray-300 transition-colors">
                            <div className="flex-1">
                                <h3 className="font-extrabold text-xl text-gray-900 tracking-tight mb-1">{item.name}</h3>
                                <p className="text-primary-700 font-bold tracking-wide">₱{Number(item.price).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                                    >−</button>
                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                                    >+</button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.product_id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-panel rounded-2xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h3>

                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>₱{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Delivery Fee</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>

                        <div className="flex justify-between font-bold text-2xl border-t border-gray-200 pt-4 mb-6 text-gray-900">
                            <span>Total</span>
                            <span className="text-primary-600">₱{totalAmount.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl uppercase tracking-wider transition-all
                                ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
