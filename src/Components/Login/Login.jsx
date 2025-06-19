import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { useAuth } from '../Auth/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const otpInputRef = useRef(null);

    const navigate = useNavigate();
    const { setMenuData } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ApiBaseUrl}/auth/v1/otp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usernameOrEmail: username,
                    password: password,
                }),
            });

            const data = await response.json();
            const statusCode = data?.statusDescription?.statusCode;
            const statusMessage = data?.statusDescription?.statusMessage;

            if (statusCode === 200) {
                setShowOtp(true);
                toast.success(statusMessage || 'OTP sent to your registered email');
            } else {
                toast.error(statusMessage || 'Invalid credentials');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${ApiBaseUrl}/auth/v1/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usernameOrEmail: username,
                    otp: otp,
                }),
            });

            const data = await response.json();
            const statusCode = data?.statusDescription?.statusCode;
            const statusMessage = data?.statusDescription?.statusMessage;

            if (statusCode === 200) {
                toast.success('OTP verified. Login successful!');
                localStorage.setItem('userName', data?.userDetail?.fullName);
                localStorage.setItem('Token', data?.userDetail?.userTokenDetail?.jwtToken);
                localStorage.setItem('id', data?.userDetail?.userTokenDetail?.id);
                localStorage.setItem('userId', data?.userDetail?.userId);

                const menuData = data?.userDetail?.role?.roleMenu || [];
                localStorage.setItem('menuData', JSON.stringify(menuData));
                setMenuData(menuData);

                navigate('/dashboard');

            } else {
                toast.error(statusMessage || 'Invalid OTP');
            }
        } catch (err) {
            toast.error('Error verifying OTP. Please try again.');
        }
    };

    useEffect(() => {
        if (showOtp && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [showOtp]);

    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="d-flex justify-content-center py-4">
                                <a className="logo d-flex align-items-center w-auto">
                                    <img src="assets/img/altruistlogo.png" alt="logo" />
                                    <span className="d-none d-lg-block">Altruist Citi Plaza</span>
                                </a>
                            </div>

                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                        <p className="text-center small">Enter your username & password to login</p>
                                    </div>

                                    <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                                        <div className="col-12">
                                            <label htmlFor="yourUsername" className="form-label">Username</label>
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control"
                                                    id="yourUsername"
                                                    required
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                                <div className="invalid-feedback">Please enter your username.</div>
                                            </div>
                                        </div>

                                        <div className="col-12 position-relative">
                                            <label htmlFor="yourPassword" className="form-label">Password</label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                className="form-control pe-5"
                                                id="yourPassword"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                            <i
                                                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                                                style={{
                                                    top: '38px',
                                                    right: '15px',
                                                    cursor: 'pointer',
                                                    zIndex: 2,
                                                }}
                                                onClick={togglePasswordVisibility}
                                            ></i>

                                            <div className="invalid-feedback">Please enter your password!</div>
                                        </div>

                                        {!showOtp && (
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="submit">
                                                    Login
                                                </button>
                                            </div>
                                        )}
                                    </form>

                                    {/* {showOtp && (
                                        <>
                                            <div className="col-12 mt-3">
                                                <label htmlFor="otp" className="form-label">Enter OTP</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="otp"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="Enter OTP"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                />
                                            </div>
                                            <div className="col-12 mt-3">
                                                <button className="btn btn-success w-100" onClick={handleVerifyOtp}>
                                                    Verify OTP
                                                </button>
                                            </div>
                                        </>
                                    )} */}
                                    {showOtp && (
                                        <>
                                            <div className="col-12 mt-3">
                                                <label htmlFor="otp" className="form-label">Enter OTP</label>
                                                <input
                                                    ref={otpInputRef}
                                                    type="text"
                                                    className="form-control"
                                                    id="otp"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="Enter OTP"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                />
                                            </div>
                                            <div className="col-12 mt-3">
                                                <button className="btn btn-success w-100" onClick={handleVerifyOtp}>
                                                    Verify OTP
                                                </button>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>

                            <div className="credits">
                                Designed by <a>Altruist Technologies Pvt. Ltd.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ToastContainer />
        </div>
    );
};

export default Login;
