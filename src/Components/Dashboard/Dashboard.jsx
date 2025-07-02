// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
// import DashboardBankBalance from './DashboardBankBalance';
// import DashboardRentSummary from './DashboardRentSummary';
// import DashboardElectricitySummary from './DashboardElectricitySummary';
// import DashboardGopalAyaanSaleTrends from './DashboardGopalAyaanSaleTrends';
// import DashboardCoupons from './DashboardCoupons';
// import DashboardSolar from './DashboardSolar';

// const Dashboard = () => {

//     const [openingBalance, setopeningBalance] = useState("0");
//     const [closingBalance, setclosingBalance] = useState("0");

//     const today = new Date();
//     today.setDate(today.getDate() - 1);
//     const ClosingdateTime = today.toLocaleDateString('en-CA');
//     const OpeningdateTime = new Date().toLocaleDateString('en-CA');

//     const handleGetOpeningClosingBalance = async () => {
//         const userId = localStorage.getItem('userId');

//         if (!userId) {
//             toast.error('Missing necessary data in localStorage');
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/dashboard/opening-closing-balance`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     userId: userId,
//                 },
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const { statusCode, description } = data.statusDescription;

//                 if (statusCode === 200) {
//                     setopeningBalance(parseFloat(data.dashboardCurrentBalance));
//                     setclosingBalance(parseFloat(data.dashboardClosingBalance));
//                 } else {
//                     toast.error(description || 'Failed to fetch balance data');
//                 }
//             } else {
//                 toast.error('Failed to fetch data. Status: ' + response.status);
//             }
//         } catch (error) {
//             toast.error('Error fetching balance data: ' + error.message);
//         }
//     };

//     useEffect(() => {
//         handleGetOpeningClosingBalance();
//     }, []);

//     return (
//         <main id="main" className="main">
//             <section className="section dashboard">
//                 <div className="row">
//                     <div className="col-lg-6">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h6 className="card-title" style={{ color: 'blue', height: '30px' }}>
//                                     Current Balance : ₹{Number(openingBalance).toLocaleString('en-IN')}
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h6 className="card-title" style={{ color: 'green', height: '30px' }}>
//                                     {/* Date: {ClosingdateTime} */}
//                                     Yesterday's
//                                     Closing Balance : ₹{Number(closingBalance).toLocaleString('en-IN')}
//                                     {/* <br /> Closing Balance : ₹{closingBalance} */}
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                     <DashboardBankBalance />
//                     <DashboardRentSummary />
//                     <DashboardElectricitySummary />
//                     <DashboardGopalAyaanSaleTrends />
//                     <DashboardCoupons />
//                     <DashboardSolar />
//                 </div>
//             </section>
//         </main >
//     );
// };

// export default Dashboard;



// import React, { useEffect, useState, useRef } from 'react';
// import { toast } from 'react-toastify';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
// import DashboardBankBalance from './DashboardBankBalance';
// import DashboardRentSummary from './DashboardRentSummary';
// import DashboardElectricitySummary from './DashboardElectricitySummary';
// import DashboardGopalAyaanSaleTrends from './DashboardGopalAyaanSaleTrends';
// import DashboardCoupons from './DashboardCoupons';
// import DashboardSolar from './DashboardSolar';

// const Dashboard = () => {
//     const [openingBalance, setopeningBalance] = useState("0");
//     const [closingBalance, setclosingBalance] = useState("0");

//     const contentRef = useRef(null); // <-- this is our content-only wrapper

//     const today = new Date();
//     today.setDate(today.getDate() - 1);
//     const ClosingdateTime = today.toLocaleDateString('en-CA');

//     const handleGetOpeningClosingBalance = async () => {
//         const userId = localStorage.getItem('userId');

//         if (!userId) {
//             toast.error('Missing necessary data in localStorage');
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/dashboard/opening-closing-balance`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     userId: userId,
//                 },
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const { statusCode, description } = data.statusDescription;

//                 if (statusCode === 200) {
//                     setopeningBalance(parseFloat(data.dashboardCurrentBalance));
//                     setclosingBalance(parseFloat(data.dashboardClosingBalance));
//                 } else {
//                     toast.error(description || 'Failed to fetch balance data');
//                 }
//             } else {
//                 toast.error('Failed to fetch data. Status: ' + response.status);
//             }
//         } catch (error) {
//             toast.error('Error fetching balance data: ' + error.message);
//         }
//     };

//     useEffect(() => {
//         handleGetOpeningClosingBalance();
//     }, []);

//     const handleDownloadPDF = async () => {
//         const input = contentRef.current;

//         const canvas = await html2canvas(input, {
//             scale: 2,
//         });

//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a4');

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         pdf.save('dashboard.pdf');
//     };

//     return (
//         <main id="main" className="main">

//             {/* Download PDF Button */}
//             <div className="d-flex justify-content-end mb-3">
//                 <button className="btn btn-sm btn-danger" onClick={handleDownloadPDF}>
//                     Download Dashboard as PDF
//                 </button>
//             </div>

//             {/* Dashboard content only */}
//             <section className="section dashboard" ref={contentRef}>
//                 <div className="row">
//                     <div className="col-lg-6">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h6 className="card-title" style={{ color: 'blue' }}>
//                                     Current Balance : ₹{Number(openingBalance).toLocaleString('en-IN')}
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h6 className="card-title" style={{ color: 'green' }}>
//                                     Yesterday's Closing Balance : ₹{Number(closingBalance).toLocaleString('en-IN')}
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Dashboard components */}
//                     <DashboardBankBalance />
//                     <DashboardRentSummary />
//                     <DashboardElectricitySummary />
//                     <DashboardGopalAyaanSaleTrends />
//                     <DashboardCoupons />
//                     <DashboardSolar />
//                 </div>
//             </section>
//         </main>
//     );
// };

// export default Dashboard;



import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useEffect, useState } from 'react';
import DashboardBankBalance from './DashboardBankBalance';
import DashboardRentSummary from './DashboardRentSummary';
import DashboardElectricitySummary from './DashboardElectricitySummary';
import DashboardGopalAyaanSaleTrends from './DashboardGopalAyaanSaleTrends';
import DashboardCoupons from './DashboardCoupons';
import DashboardSolar from './DashboardSolar';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const Dashboard = ({ bankBalance, netBalance }) => {
    const contentRef = useRef(null);
    // const [openingBalance, setopeningBalance] = useState("0");
    // const [closingBalance, setclosingBalance] = useState("0");
    const [chartData, setChartData] = useState([]);
    const [netBalances, setNetBalances] = useState({
        bankBalance: 0,
        netBalance: 0,
    });

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const ClosingdateTime = today.toLocaleDateString('en-CA');
    const OpeningdateTime = new Date().toLocaleDateString('en-CA');

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
                    // setopeningBalance(parseFloat(data.dashboardCurrentBalance));
                    // setclosingBalance(parseFloat(data.dashboardClosingBalance));
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

                    const sorted = summary.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const latest = sorted[0];

                    const formatted = [];

                    if (latest.bankBalance !== null) {
                        formatted.push({ value: latest.bankBalance, name: 'Bank Bal.' });
                    }
                    if (latest.netBalance !== null) {
                        formatted.push({ value: latest.netBalance, name: 'Net Bal.' });
                    }

                    setChartData(formatted);

                    setNetBalances({
                        bankBalance: latest.bankBalance,
                        netBalance: latest.netBalance,
                    });
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
        // handleGetOpeningClosingBalance();
        handleGetBankBalanceData();
    }, []);

    const handleDownloadPDF = async () => {
        const input = contentRef.current;
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('dashboard.pdf');
    };

    const handleDownloadImage = async () => {
        const input = contentRef.current;
        const canvas = await html2canvas(input, { scale: 2 });
        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = 'dashboard.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard" ref={contentRef}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'blue' }}>
                                    Bank Balance: ₹{Number(netBalances.bankBalance).toLocaleString('en-IN')}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'green' }}>
                                    Net Balance: ₹{Number(netBalances.netBalance).toLocaleString('en-IN')}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <DashboardBankBalance />
                    <DashboardRentSummary />
                    <DashboardElectricitySummary />
                    <DashboardGopalAyaanSaleTrends />
                    <DashboardCoupons />
                    <DashboardSolar />
                </div>
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-sm btn-danger me-3" onClick={handleDownloadPDF}>
                        Download PDF
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={handleDownloadImage}>
                        Download Image
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Dashboard;