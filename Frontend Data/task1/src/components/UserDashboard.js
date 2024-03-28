import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const { isAdminAuthenticated, setIsAdminAuthenticated } = useAuth();

    const fetchUserData = async () => {
        try {
            // console.log(location.state.id)
            const response = await axios.get(`http://localhost:5001/user/${location.state.id}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchUserData();
        }
    }, [isAdminAuthenticated]);

    const handleSignOut = () => {
        setIsAdminAuthenticated(true);
        navigate('/signin');

    };


    if (!isAdminAuthenticated) {
        return <div className="container">Access denied. Please log in as an admin.</div>;
    }

    return (
        <div className="container">
            <h2>User Dashboard</h2>
            {userData ? (
                <div>

                    <img width={200} height={200} src={userData.pImage} alt='Profile' />
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Phone: {userData.phone}</p>
                    <button onClick={handleSignOut}>Sign Out</button>

                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default UserDashboard;
