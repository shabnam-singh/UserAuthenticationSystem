import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        profileImage: '', // P
        password: ''
    });
    const [image, setImage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: ", error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.mobile);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('pImage', image);

        var object = {};
        formDataToSend.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        try {
            const response = await axios.post('http://localhost:5001/user', json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            console.log('Sign-up successful:', response.data);
            alert("User Register Successfully....")

        } catch (error) {
            console.error('Error signing up:', error);
        }

    };

    return (
        <div className="container">
            <h2>User Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <label htmlFor="mobile">Mobile Number:</label>
                <input type="tel" id="mobile" name="mobile" pattern="[6-9]{1}[0-9]{9}" value={formData.mobile} onChange={handleChange} required />

                <label htmlFor="image">File Upload (Image File):</label>
                <input type="file" id="image" name="profileImage" accept=".png , .jpeg, .jpg" onChange={handleFileChange} required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <input type="submit" value="Sign Up" />
            </form>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
            <p>Admin? <a href="/admin">Admin Login</a></p>
        </div>
    );
};

export default SignUpForm;
