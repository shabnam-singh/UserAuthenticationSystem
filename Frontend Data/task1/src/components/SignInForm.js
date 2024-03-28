import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const SignInForm = () => {
    const [formData, setFormData] = useState({
        number: '',
        pass: ''
    });
    const navigate = useNavigate();
    const { setIsAdminAuthenticated } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/user/signin', formData);
            
            const { user } = response.data;
            if (user && user._id) {
                setIsAdminAuthenticated(true);
                 navigate('/userDashboard',{state:{id:user._id}});
            } else {
                 console.error('User ID not found in response');
                
            }
        } catch (error) {
            alert("incorrect details...")
            console.error('Error signing in:', error.response.data.message);
        }
    };
    
    


    return (
        <div className="container">
            <h2>User Sign In</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Number">Number:</label>
                <input type="tel" id="phone" name="number" pattern="[6-9]{1}[0-9]{9}" value={formData.number} onChange={handleChange} required></input>
            
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="pass" value={formData.pass} onChange={handleChange} required />
                <input type="submit" value="Sign In" />
            </form>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            <p>Admin? <a href="/admin">Admin Login</a></p>
        </div>
    );
};

export default SignInForm;
