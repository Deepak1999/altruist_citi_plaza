import React, { useEffect, useState } from 'react';
import DashboardWaterfallChart from './DashboardWaterfallChart';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const DashboardBankBalance = () => {

    const [chartData, setChartData] = useState([]);
    const [lastUpdatetDate, setlastUpdatetDate] = useState();

    const formatDateWithSuffix = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();

        const getDaySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();

        return `${day}${getDaySuffix(day)} ${month} ${year}`;
    };

    const formattedDate = formatDateWithSuffix(lastUpdatetDate);

    const handleGetBankBalanceData = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing userId in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/bank-summary/all`, {
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
                    const summary = data.dailyBankSummary || [];

                    if (!summary.length) {
                        toast.info('No data available');
                        return;
                    }

                    const latest = summary.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                    setlastUpdatetDate(latest.createdAt);

                    const points = [];

                    if (latest.bankBalance !== null) points.push({ label: 'Bank Bal.', y: latest.bankBalance });
                    if (latest.mobisoft !== null) points.push({ label: 'Mobisoft', y: latest.mobisoft });
                    if (latest.atpl !== null) points.push({ label: 'ATPL', y: latest.atpl });
                    if (latest.rsHospitality !== null) points.push({ label: 'RS Hosp.', y: latest.rsHospitality });
                    if (latest.netBalance !== null) points.push({ label: 'Net Bal.', y: latest.netBalance, isCumulativeSum: true, color: "#2196F3" });

                    setChartData(points);
                } else {
                    toast.error(statusMessage || 'Failed to fetch data');
                }
            } else {
                toast.error('Failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetBankBalanceData();
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card position-relative">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">Bank Balance Summary - INR</h5>
                        <strong>
                            <small style={{ color: '#dc2804', fontSize: '0.80rem' }}>
                                Last Update : {formattedDate}
                            </small>
                        </strong>
                    </div>
                    <div style={{ width: '100%', height: '400px', marginTop: '15px' }}>
                        <DashboardWaterfallChart dataPoints={chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardBankBalance;