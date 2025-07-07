import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useEffect, useState } from 'react';
import DashboardBankBalance from './DashboardBankBalance';
import DashboardRentSummary from './DashboardRentSummary';
import DashboardElectricitySummary from './DashboardElectricitySummary';
import DashboardGopalAyaanSaleTrends from './DashboardGopalAyaanSaleTrends';
import DashboardCoupons from './DashboardCoupons';
import DashboardSolar from './DashboardSolar';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const Dashboard = () => {
    const contentRef = useRef(null);
    const [netBalances, setNetBalances] = useState({
        bankBalance: 0,
        netBalance: 0,
        payable: 0,
        receivable: 0,
    });

    const handleGetBankBalanceData = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
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

                    const summary = data.dailyBankSummary;

                    if (summary && typeof summary === 'object') {
                        setNetBalances({
                            bankBalance: summary.bankBalance || 0,
                            netBalance: summary.netBalance || 0,
                            payable: data.bankAmountPayable || 0,
                            receivable: data.bankAmountReceivable || 0,
                        });
                    }
                } else {
                    toast.error(statusMessage || 'Failed to fetch data');
                }
            } else {
                toast.error('Failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetBankBalanceData();
    }, []);

    const handleDownloadPdfImageAndSentEmail = async () => {
        const input = contentRef.current;

        const now = new Date();
        const dateTimeString = now.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const timestampEl = document.getElementById('report-timestamp');
        if (timestampEl) {
            timestampEl.innerText = `Generated on: ${dateTimeString}`;
        }

        try {
            const canvas = await html2canvas(input, { scale: 1.5 });

            if (timestampEl) {
                timestampEl.innerText = '';
            }

            const imageBlob = await new Promise((resolve) =>
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
            );

            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'dashboard.pdf');
            formData.append('image', imageBlob, 'dashboard.jpg');

            const response = await fetch(`${ApiBaseUrl}/mail/send-files-email`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.statusDescription.statusCode === 200) {
                const description = result.statusDescription.description || 'Success';
                const recipients = result.data?.join(', ') || 'No recipients';
                toast.success(`${description}. Sent to: ${recipients}`);
            } else {
                toast.error(result.statusDescription.description || `Failed to send email. Status: ${response.status}`);
            }
        } catch (error) {
            if (timestampEl) {
                timestampEl.innerText = '';
            }
            toast.error('Error sending email: ' + error.message);
        }
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard" ref={contentRef}>
                <div
                    id="report-timestamp"
                    style={{
                        textAlign: 'right',
                        marginBottom: '10px',
                        fontSize: '12px',
                        color: '#555',
                    }}
                ></div>

                <div className="row">
                    <div className="col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'green', height: '50px' }}>
                                    Bank Balance:<br />₹
                                    {Math.floor(netBalances.bankBalance).toLocaleString('en-IN')}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: '#e30e0e', height: '50px' }}>
                                    Payable:<br />₹{netBalances.payable}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'blue', height: '50px' }}>
                                    Receivable:<br />₹{netBalances.receivable}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: 'blue', height: '50px' }}>
                                    Final Net Balance:<br />₹
                                    {Math.floor(netBalances.netBalance).toLocaleString('en-IN')}
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
                    <button
                        className="btn btn-sm btn-success me-3"
                        onClick={handleDownloadPdfImageAndSentEmail}
                    >
                        Generate Report & Send Email
                    </button>
                </div>
            </section>
            <ToastContainer />
        </main>
    );
};

export default Dashboard;
