import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { setIsAdminAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { email, password } = formData;
        if (email === 'admin@domain.com' && password === 'admin') {
            setIsAdminAuthenticated(true);
            navigate('/adminPanel');
        } else {
            alert('Invalid email or password');
        }
    };

    return (
        <div className="container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <input type="submit" value="Login" />
            </form>
            <p>User Sign? <a href="/signin">Sign In</a></p>

        </div>
    );
};

export default AdminLogin;
