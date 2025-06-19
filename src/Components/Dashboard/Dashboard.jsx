import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import DashboardBankBalance from './DashboardBankBalance';
import DashboardRentSummary from './DashboardRentSummary';
import DashboardElectricitySummary from './DashboardElectricitySummary';
import DashboardGopalAyaanSaleTrends from './DashboardGopalAyaanSaleTrends';

const Dashboard = () => {

    const dateTime = new Date().toLocaleDateString('en-CA');
    const [openingBalance, setopeningBalance] = useState("0");
    const [closingBalance, setclosingBalance] = useState("0");

    const handleGetOpeningClosingBalance = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/opening-closing-balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, description } = data.statusDescription;

                if (statusCode === 200) {
                    setopeningBalance(parseFloat(data.dashboardOpeningBalance));
                    setclosingBalance(parseFloat(data.dashboardClosingBalance));
                } else {
                    toast.error(description || 'Failed to fetch balance data');
                }
            } else {
                toast.error('Failed to fetch data. Status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching balance data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetOpeningClosingBalance();
    }, []);

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'green' }}>
                                    Date: {dateTime}
                                    <br />
                                    Opening Balance : ₹{openingBalance}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'blue' }}>
                                    Date: {dateTime}
                                    <br />
                                    Closing Balance : ₹{closingBalance}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <DashboardBankBalance />
                    <DashboardRentSummary />
                    <DashboardElectricitySummary />
                    <DashboardGopalAyaanSaleTrends />
                </div>
            </section>
        </main>
    );
};

export default Dashboard;