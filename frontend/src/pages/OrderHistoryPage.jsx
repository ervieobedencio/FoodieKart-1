import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const successMessage = location.state?.successMessage;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch order history", error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Preparing': 'bg-blue-100 text-blue-800 border-blue-200',
            'Ready': 'bg-green-100 text-green-800 border-green-200'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${colors[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="text-center py-24 text-gray-500 animate-pulse text-lg tracking-wide">Loading amazing food history...</div>;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-10 tracking-tight">My Orders</h1>

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-10 font-medium flex items-center shadow-sm">
                    <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    {successMessage}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="glass-panel rounded-3xl p-16 text-center">
                    <div className="text-7xl mb-6 opacity-80">🧾</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet. Time to get hungry!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order.order_id} className="glass-panel rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                            <div className="bg-gray-50/50 border-b p-5 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        Order #{String(order.order_id).padStart(5, '0')}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="font-extrabold text-gray-900">₱{Number(order.total_amount).toFixed(2)}</p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>

                            <div className="p-5">
                                <ul className="divide-y divide-gray-100">
                                    {order.items.map(item => (
                                        <li key={item.order_item_id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="bg-primary-100 text-primary-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm mr-4">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-medium text-gray-800">{item.product.name}</span>
                                            </div>
                                            <span className="text-gray-600 font-medium">₱{Number(item.subtotal).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
