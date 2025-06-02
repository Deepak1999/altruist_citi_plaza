import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { Link } from 'react-router-dom';

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const Name = localStorage.getItem('userName');
    const Fname = localStorage.getItem('userName');
    const role = localStorage.getItem('name');

    useEffect(() => {
        if (sidebarOpen) {
            document.body.classList.remove('toggle-sidebar');
        } else {
            document.body.classList.add('toggle-sidebar');
        }
    }, [sidebarOpen]);

    const handleSidebarToggle = () => {
        setSidebarOpen(prev => !prev);
    };

    const logout = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/auth/v1/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, statusMessage } = data.statusDescription;

                if (statusCode === 200) {
                    toast.success(statusMessage || 'Logout successful');
                    localStorage.clear();
                    window.location.href = '/';
                } else {
                    toast.error(statusMessage || 'Logout failed');
                }
            } else {
                toast.error('Logout failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during logout: ' + error.message);
        }
    };

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <a className="logo d-flex align-items-center">
                    <img src="assets/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">Citi Plaza Mall</span>
                </a>
                <i
                    className="bi bi-list toggle-sidebar-btn"
                    onClick={handleSidebarToggle}
                    style={{ cursor: 'pointer' }}
                ></i>
            </div>

            <div className="search-bar">
                <formm className="search-form d-flex align-items-center">
                    <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                    <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                </formm>
            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-lg-none">
                        <a className="nav-link nav-icon search-bar-toggle ">
                            <i className="bi bi-search"></i>
                        </a>
                    </li>

                    <li className="nav-item dropdown pe-3">
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                            <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2" style={{ cursor: 'pointer' }}>{Name}</span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{Fname}</h6>
                                <span>{role}</span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <Link to="/my-profile" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" onClick={logout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span style={{ cursor: 'pointer' }}>Sign Out</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>

            <ToastContainer />
        </header>
    );
};

export default Header;
