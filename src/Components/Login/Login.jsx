import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ApiBaseUrl}/abuzz-admin/account/web/v1/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    passwd: password,
                }),
            });

            const data = await response.json();

            const statusCode = data?.statusDescription?.statusCode;
            const statusMessage = data?.statusDescription?.statusMessage;

            if (statusCode === 200) {
                toast.success('Login successful!');
                localStorage.setItem('userName', data.adminUser.userName);
                localStorage.setItem('name', data.adminUser.name);
                localStorage.setItem('id', data.adminUser.id);
                localStorage.setItem('token', data.adminUser.admUserTokenDetails.jwtToken);
                localStorage.setItem('source', data.adminUser.loginSource);

                navigate('/dashboard');
            } else {
                toast.error(statusMessage || 'Invalid credentials');
            }

        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        }
    };


    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="d-flex justify-content-center py-4">
                                <a className="logo d-flex align-items-center w-auto">
                                    <img src="assets/img/logo.png" alt="logo" />
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

                                        <div className="col-12">
                                            <label htmlFor="yourPassword" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                id="yourPassword"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <div className="invalid-feedback">Please enter your password!</div>
                                        </div>

                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit">
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="credits">
                                Designed by <a>Altruist Tech Teams</a>
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
