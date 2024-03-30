import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { RecaptchaVerifier, createUserWithEmailAndPassword, sendEmailVerification, signInWithPhoneNumber } from 'firebase/auth';
import { auth, auth2 } from '../firebase/setup';
import { useNavigate } from 'react-router-dom';


const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        profileImage: '',
        password: ''
    });
    const [image, setImage] = useState("");
    const [dv, showVerifyBtn] = useState(false);
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState(null);
    const [phoneOTP, setPHoneOTP] = useState("");
    const [otpMsg, setOTPMsg] = useState("");
    const [emailMsg, setEmailMessage] = useState("");


    const [flag1, setFlag1] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [isEmailVerify, setIsEmailVerified] = useState(false);



    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (emailMsg === " Email Verified..." || emailMsg === " Email is already in use.") {
            setFlag1(true);
            setIsEmailVerified(true);
        }
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
        if (!isEmailVerify) {
            alert("Please Verify Email First\nReload page to check verification status");
            return
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', phone);
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
            navigate('/admin');

        } catch (err) {
            if (err.response && err.response.status === 500) {
                alert('Duplicate Key Entry');
            } else {
                console.error('Error signing up:', err);
            }
          
        }

    };


    const verifyEmail = async () => {
        if (formData.email === "") {
            alert("Please Enter Email");
            return
        }

        // setEmailMessage("Verification Link Sent Successfully");
        // return

        try {
            const userCred = await createUserWithEmailAndPassword(auth2, formData.email, "admin123");
            const user = userCred.user;
            await sendEmailVerification(user);
            setEmailMessage("Verification Link Sent Successfully");

        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setFlag1(true);
                console.error("Error Message from verifyEmail", err.code);
                setEmailMessage(" Email is already in use.");
            } else {
                console.error("Error in Verifying Email:", err);
            }
        }
    };

    useEffect(() => {
        // setFlag1(true);
        // setEmailMessage(" Email Verified...");
        // return

        const unsubscribe = auth2.onAuthStateChanged((user) => {
            if (user) {
                setIsEmailVerified(user.emailVerified);
                if (user.emailVerified) {
                    setFlag1(true);
                    setEmailMessage(" Email Verified...");
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        email: user.email,
                    }));

                }
            }
        });

        return () => unsubscribe(); 
    }, []);



    const sendOTPButton = async () => {
        const regex = /^\+91[6-9]\d{4}[-]?\d{5}$/;
        const isValidPhoneNumber = regex.test(phone);
        if (phone === "") {
            alert("Enter Phone Number");
            return
        }
        if (!isValidPhoneNumber) {
            alert("Phone number Should Start from 6-9 \n and should be 10 digit")
            return
        }

        // showVerifyBtn(true);
        // setOTPMsg(" OTP Sent Successfully")
        // return

        try {
            const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
            const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
            setUser(confirmation);
            showVerifyBtn(true);
            setOTPMsg("OTP Sent Successfully");
            document.getElementById('recaptcha').innerHTML = ""

        } catch (err) {
            if (err.code === "auth/too-many-requests") {
                console.error("Too many OTP requests. Please try again later.");

                setOTPMsg("Too many OTP requests. Please try again later.");
            } else if (err.code === "auth/invalid-phone-number") {
                console.error("Invalid phone number. Please enter a valid phone number.");

                setOTPMsg("Invalid phone number. Please enter a valid phone number.");
            } else {

                console.error("Error in Sending OTP:", err.code);
            }
        }

    }

    const verifyPhoneOTP = async () => {
        // setFlag2(true)
        // return
        try {
            let userData = await user.confirm(phoneOTP)
            console.log(userData)
            setFlag2(true);
            setOTPMsg(" Phone Number Verified...")
        }
        catch (err) {
            if (err.code === "auth/phone-number-already-exists") {
                setFlag2(true);
                console.error("Phone no is already in use:", err.code);
                setOTPMsg("Phone no is already in use.");
            } else if (err.code === "auth/invalid-phone-number") {
                alert("Invalid Phone Number");
            }
            else {
                setOTPMsg("Error in OTP Verification")

            }

        }

    }

    return (
        <div>
            <h2>User Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className='leftLabel container'>
                    <label className="mylabel" htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                    <button type='button' className='mybtn' onClick={verifyEmail}>Send Verification Link</button><span style={{ fontSize: 'x-small' }}>{emailMsg}</span><br />

                    <label htmlFor="mobile">Mobile Number:</label>
                    
                    <PhoneInput
                        country={'in'}
                        value={phone}
                        onChange={(phone) => setPhone("+" + phone)}
                    />


                    <div id='recaptcha' style={{ marginTop: '2px' }}></div>


                    <button type='button' className='mybtn' onClick={sendOTPButton}>Send OTP</button><span style={{ fontSize: 'x-small' }}>{otpMsg}</span><br />

                    {
                        dv && <div>
                            <table>

                                <tr>
                                    <td>
                                        <input type="text" placeholder='Enter Phone OTP' onChange={(e) => setPHoneOTP(e.target.value)} />
                                    </td>
                                    <td>
                                        <button type='button' className='mybtn' onClick={verifyPhoneOTP}>Verify Phone</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    }

                    <label htmlFor="image">File Upload (Image File):</label>
                    <input type="file" id="image" name="profileImage" accept=".png , .jpeg, .jpg" onChange={handleFileChange} required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    {flag1 && flag2 ? <input type="submit" value="Sign Up" /> : ""}
                </div>
            </form>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
            <p>Admin? <a href="/admin">Admin Login</a></p>
        </div>
    );
};

export default SignUpForm;
