import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const Profile = () => {

    const FName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword) {
            toast.error('Please enter a new password.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${ApiBaseUrl}/auth/v1/change/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify({ newPassword })
            });

            const data = await response.json();

            if (response.ok && data.statusDescription?.statusCode === 200) {
                toast.success(data.statusDescription.description || 'Password changed successfully!');
                setNewPassword('');
            } else {
                toast.error(data.statusDescription?.description || 'Failed to change password.');
            }
        } catch (err) {
            toast.error('Something went wrong while changing password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="main" className="main">
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="card">
                            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                                <h2>{FName}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-body pt-2">
                                <ul className="nav nav-tabs nav-tabs-bordered">
                                    <li className="nav-item">
                                        <button
                                            className="nav-link active"
                                            data-bs-toggle="tab"
                                            data-bs-target="#profile-change-password"
                                        >
                                            Change Password
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content pt-4">
                                    <div className="tab-pane fade show active pt-3" id="profile-change-password">
                                        <form onSubmit={handleChangePassword}>
                                            <div className="row mb-3">
                                                <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">
                                                    New Password
                                                </label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input
                                                        name="newpassword"
                                                        type="password"
                                                        className="form-control"
                                                        id="newPassword"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                                    {loading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </main>
    );
};

export default Profile;