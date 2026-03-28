import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login({ email, password });
            navigate(data.user.role === 'admin' ? '/admin' : '/menu');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 glass-panel rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        required
                        className="input-field p-3"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        required
                        className="input-field p-3"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <button type="submit" className="w-full btn-primary text-lg">
                    Sign In
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register here</Link>
            </p>
        </div>
    );
}
