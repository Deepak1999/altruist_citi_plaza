import React, { useEffect, useState } from 'react'
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddMeterRecharge = () => {

    const [billType, setBillType] = useState('');
    const [formData, setFormData] = useState({
        lesseeName: '',
        monthYear: '',
        paidAmount: '',
        amountBilled: '',
        remarks: '',
        paymentStatus: '',
    });
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentModeId, setPaymentModeId] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentModeChange = (e) => {
        setPaymentModeId(e.target.value);
    };

    const handleGetLesseeDetails = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/lessee-details-all`, {
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
                    const lesseeDetails = data.lesseeDetails.map((mode) => ({
                        id: mode.id,
                        name: mode.name,
                        rentAgreements: mode.rentAgreements || [],
                    }));
                    setLesseeDetails(lesseeDetails);
                } else {
                    toast.error(statusMessage || 'Failed to fetch lessee details');
                }
            } else {
                toast.error('Failed to fetch lessee details with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetching lessee details: ' + error.message);
        }
    };

    const handleGetPaymentMode = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/payment-modes-all`, {
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
                    const paymentModes = data.paymentModes.map((mode) => ({
                        id: mode.id,
                        name: mode.modeName,
                    }));
                    setPaymentMode(paymentModes);
                } else {
                    toast.error(statusMessage || 'Failed to fetch payment modes');
                }
            } else {
                toast.error('Failed to fetch payment modes with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetching payment modes: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('User ID not found in localStorage.');
            return;
        }

        const payload = {
            electricityBillLog: {
                lesseeId: formData.lesseeId,
                lesseeName: formData.lesseeName,
                monthYear: formData.monthYear,
                billType: Number(billType),
                amountPaid: parseFloat(formData.paidAmount),
                billedAmount: formData.amountBilled ? parseFloat(formData.amountBilled) : null,
                paymentStatus: formData.paymentStatus === 'Paid' ? 1 : formData.paymentStatus === 'Unpaid' ? 2 : null,
                remarks: formData.remarks || '',
                paymentMode: paymentModeId
            }
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/bill-logs/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result?.statusDescription?.statusCode === 200) {
                toast.success(result?.statusDescription.description || 'Meter recharge details submitted successfully!');
                handleResetForm();
                setTimeout(() => {
                    navigate('/viewMeterRecharge');
                }, 3000);
            } else {
                toast.error(result.statusDescription?.description || 'Submission failed');
            }
        } catch (error) {
            toast.error('Error submitting data: ' + error.message);
        }
    };

    const handleResetForm = () => {
        setLesseeDetails([]);
        setPaymentMode([]);
        setPaymentModeId('');
        setFormData({
            lesseeName: '',
            monthYear: '',
            paidAmount: '',
            amountBilled: '',
            remarks: '',
            paymentStatus: '',
        });
    }

    useEffect(() => {
        handleGetLesseeDetails();
        handleGetPaymentMode();
    }, []);

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Meter Recharge Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Bill Type</label>
                                            <select
                                                className="form-select"
                                                value={billType}
                                                onChange={(e) => setBillType(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="1">Postpaid</option>
                                                <option value="2">Prepaid</option>
                                            </select>
                                        </div>
                                    </div>

                                    {billType && (
                                        <>
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="form-label">Lessee Name</label>
                                                    <select
                                                        className="form-select"
                                                        name="lesseeId"
                                                        value={formData.lesseeId || ''}
                                                        onChange={(e) => {
                                                            const selectedId = parseInt(e.target.value);
                                                            const selectedLessee = lesseeDetails.find(l => l.id === selectedId);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                lesseeId: selectedId,
                                                                lesseeName: selectedLessee?.name || ''
                                                            }));
                                                        }}
                                                        required
                                                    >
                                                        <option value="">Select Lessee</option>
                                                        {lesseeDetails.map((lessee) => (
                                                            <option key={lessee.id} value={lessee.id}>
                                                                {lessee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label">Month & Year</label>
                                                    <input
                                                        type="month"
                                                        className="form-control"
                                                        name="monthYear"
                                                        value={formData.monthYear}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Payment Mode</label>
                                                    <select
                                                        className="form-select"
                                                        value={paymentModeId}
                                                        onChange={handlePaymentModeChange}
                                                    >
                                                        <option value="">Select Mode</option>
                                                        {paymentMode.map((mode) => (
                                                            <option key={mode.id} value={mode.id}>
                                                                {mode.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* <div className="col-md-3">
                                                    <label className="form-label">Remarks</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="remarks"
                                                        value={formData.remarks}
                                                        onChange={handleChange}
                                                    />
                                                </div> */}

                                                {billType === '2' && (
                                                    <>
                                                        <div className="col-md-3">
                                                            <label className="form-label">Amount Received</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="paidAmount"
                                                                value={formData.paidAmount}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        {/* <div className="col-md-3">
                                                            <label className="form-label">Remarks</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="remarks"
                                                                value={formData.remarks}
                                                                onChange={handleChange}
                                                            />
                                                        </div> */}
                                                        <div className="col-md-3">
                                                            <label className="form-label">Remarks</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="remarks"
                                                                value={formData.remarks}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {billType === '1' && (
                                                    <>
                                                        <div className="col-md-3">
                                                            <label className="form-label">Amount Billed</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="amountBilled"
                                                                value={formData.amountBilled}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">Amount Received</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="paidAmount"
                                                                value={formData.paidAmount}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label d-block">Payment Status</label>
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="paymentStatus"
                                                                    value="Paid"
                                                                    checked={formData.paymentStatus === 'Paid'}
                                                                    onChange={handleChange}
                                                                />
                                                                <label className="form-check-label">Paid</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="paymentStatus"
                                                                    value="Unpaid"
                                                                    checked={formData.paymentStatus === 'Unpaid'}
                                                                    onChange={handleChange}
                                                                />
                                                                <label className="form-check-label">Unpaid</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">Remarks</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="remarks"
                                                                value={formData.remarks}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handleResetForm} >Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </main>
    );
};

export default AddMeterRecharge