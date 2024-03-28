import React from 'react';
import "./App.css";
import {
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";


import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';

const App = () => {
  return (
    <>
      <center>

        <Routes>
          <Route exact path="/" element={
            <>
              <SignInForm />
            </>
          }
          />

          <Route exact path="/admin" element={<AdminLogin />} />

          <Route exact path="/signin" element={<SignInForm />} />

          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/userDashboard" element={<UserDashboard />} />



        </Routes>

      </center>
    </>

  );
}

export default App;
