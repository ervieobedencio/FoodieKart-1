import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/menu');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="max-w-md mx-auto mt-16 glass-panel rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input name="full_name" type="text" required className="input-field p-2.5" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input name="email" type="email" required className="input-field p-2.5" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input name="phone_number" type="tel" required className="input-field p-2.5" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input name="password" type="password" required minLength="8" className="input-field p-2.5" onChange={handleChange} />
                </div>

                <button type="submit" className="w-full btn-primary text-lg mt-4">
                    Register
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
            </p>
        </div>
    );
}
