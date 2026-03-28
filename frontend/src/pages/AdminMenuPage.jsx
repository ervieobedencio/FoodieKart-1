import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminMenuPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null); // id of product being edited, or 'new'

    // Form state
    const [formData, setFormData] = useState({ name: '', description: '', price: '', is_available: true });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product = null) => {
        if (product) {
            setFormData({ ...product });
            setIsEditing(product.product_id);
        } else {
            setFormData({ name: '', description: '', price: '', is_available: true });
            setIsEditing('new');
        }
    };

    const handleCancel = () => {
        setIsEditing(null);
        setFormData({ name: '', description: '', price: '', is_available: true });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing === 'new') {
                await api.post('/admin/products', formData);
            } else {
                await api.put(`/admin/products/${isEditing}`, formData);
            }
            fetchProducts();
            handleCancel();
        } catch (error) {
            alert('Failed to save product details.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product.');
        }
    };

    const toggleAvailability = async (product) => {
        try {
            await api.put(`/admin/products/${product.product_id}`, {
                ...product,
                is_available: !product.is_available
            });
            fetchProducts();
        } catch (error) {
            console.error("Failed to toggle status");
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Menu Manager...</div>;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 tracking-tight">Menu Management</h1>
                {!isEditing && (
                    <button onClick={() => handleEditClick()} className="btn-primary flex items-center gap-2 shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add Product
                    </button>
                )}
            </div>

            {/* Inline Form */}
            {isEditing && (
                <div className="glass-panel p-6 rounded-xl mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">{isEditing === 'new' ? 'New Product' : 'Edit Product'}</h2>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input required type="text" className="input-field p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea className="input-field p-2" rows="2" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₱)</label>
                            <input required type="number" step="0.01" min="0" className="input-field p-2" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="flex items-center space-x-2 h-10 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                <input type="checkbox" className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} />
                                <span className="font-medium">Currently Available</span>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary">Save Product</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Data Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100/50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">Product</th>
                            <th className="p-4 font-semibold text-gray-600">Price</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.product_id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                </td>
                                <td className="p-4 font-medium">₱{Number(product.price).toFixed(2)}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleAvailability(product)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors
                                            ${product.is_available ? 'bg-green-100 text-green-800 border-green-200 hover:bg-red-100 hover:text-red-800' : 'bg-red-100 text-red-800 border-red-200 hover:bg-green-100 hover:text-green-800'}`}
                                        title="Click to toggle"
                                    >
                                        {product.is_available ? 'Available' : 'Sold Out'}
                                    </button>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-800 p-2">Edit</button>
                                    <button onClick={() => handleDelete(product.product_id)} className="text-red-600 hover:text-red-800 p-2">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div className="p-8 text-center text-gray-500">No products configured yet.</div>}
            </div>
        </div>
    );
}
