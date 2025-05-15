import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

const MainLayout = ({ children }) => {
    return (
        <div className="app-wrapper d-flex">
            <Sidebar />
            <div className="main-content w-100">
                <Header />
                <div className="page-content p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
