import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const AdminPanel = () => {
    const { isAdminAuthenticated, setIsAdminAuthenticated } = useAuth();
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchData();
        }
    }, [isAdminAuthenticated]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/user');
            setDocuments(response.data);
            

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSignOut = () => {
        setIsAdminAuthenticated(true);
        navigate('/admin');

    };


    if (!isAdminAuthenticated) {
        return <div className="container">Access denied. Please log in as an admin.</div>;
    }

    return (
        <div className="container" style={{width:'500px'}}>
            <h2>Admin Panel</h2>
            <button onClick={handleSignOut}>Sign Out</button>
            <table>
                <thead>
                    <tr>
                        <th>Profile Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((document) => (
                        <tr key={document._id}>
                            <td><img width={100} height={100} src={document.pImage} alt='Profile'/></td>
                            <td>{document.name}</td>
                            <td>{document.email}</td>
                            <td>{document.phone}</td>
                            <td>{document.password}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
