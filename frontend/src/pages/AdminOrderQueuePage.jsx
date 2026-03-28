import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function OrderQueuePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch admin order queue", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll for new orders every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
            fetchOrders(); // refresh view immediately
        } catch (error) {
            alert('Failed to update status');
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

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Kitchen Queue...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-10 tracking-tight">Live Kitchen Queue</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {orders.map(order => (
                    <div key={order.order_id} className={`glass-panel border-t-4 rounded-2xl flex flex-col h-full hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300
                        ${order.status === 'Pending' ? 'border-t-yellow-400' :
                            order.status === 'Preparing' ? 'border-t-blue-400' : 'border-t-green-400'}
                    `}>
                        <div className="p-5 border-b flex justify-between items-start bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Order #{String(order.order_id).padStart(5, '0')}</h3>
                                <p className="text-sm text-gray-500">{order.user.full_name}</p>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={order.status} />
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(order.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 flex-grow overflow-y-auto max-h-60">
                            <ul className="space-y-3">
                                {order.items.map(item => (
                                    <li key={item.order_item_id} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-primary-600">{item.quantity}x</span>
                                            <span className="font-medium text-gray-800">{item.product.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-5 border-t bg-gray-50/80 mt-auto rounded-b-2xl">
                            {order.status === 'Pending' && (
                                <button
                                    onClick={() => updateStatus(order.order_id, 'Preparing')}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
                                >
                                    Start Preparing
                                </button>
                            )}
                            {order.status === 'Preparing' && (
                                <button
                                    onClick={() => updateStatus(order.order_id, 'Ready')}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
                                >
                                    Mark as Ready
                                </button>
                            )}
                            {order.status === 'Ready' && (
                                <div className="w-full text-center text-green-700 font-bold py-3 bg-green-50 rounded-xl border border-green-200">
                                    Ready for Pickup
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No active orders in the queue.
                    </div>
                )}
            </div>
        </div>
    );
}
