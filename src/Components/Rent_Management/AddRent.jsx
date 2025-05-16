import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const AddRent = () => {
    const [paymentMode, setPaymentMode] = useState([]);
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [selectedLesseeId, setSelectedLesseeId] = useState('');
    const [rentAmounts, setRentAmounts] = useState([]);
    const [selectedRentAmount, setSelectedRentAmount] = useState('');
    const [paymentModeId, setPaymentModeId] = useState('');
    const [amountToPay, setAmountToPay] = useState('');
    const [remarks, setRemarks] = useState('');

    const handleGetPaymentMode = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
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

    const handleGetLesseeDetails = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
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

    useEffect(() => {
        handleGetPaymentMode();
        handleGetLesseeDetails();
    }, []);

    const handleLesseeChange = (e) => {
        const lesseeId = e.target.value;
        setSelectedLesseeId(lesseeId);

        const selectedLessee = lesseeDetails.find(l => l.id === parseInt(lesseeId));

        if (selectedLessee) {
            const activeAgreements = selectedLessee.rentAgreements.filter(ra => ra.isActive);
            const amounts = activeAgreements.map(ra => ra.fixedRentAmount);
            setRentAmounts(amounts);
        } else {
            setRentAmounts([]);
        }
    };

    const handleRentAmountChange = (e) => {
        setSelectedRentAmount(e.target.value);
    };

    const handlePaymentModeChange = (e) => {
        setPaymentModeId(e.target.value);
    };

    const handleAmountToPayChange = (e) => {
        setAmountToPay(e.target.value);
    };

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const userId = localStorage.getItem('userId');

    //     if (!selectedLesseeId || !selectedRentAmount || !paymentModeId || !amountToPay) {
    //         toast.error('Please fill in all required fields');
    //         return;
    //     }

    //     if (!userId) {
    //         toast.error('User ID is missing in localStorage');
    //         return;
    //     }

    //     const requestBody = {
    //         monthlyRentLog: {
    //             lesseeId: parseInt(selectedLesseeId),
    //             rentAmount: parseFloat(selectedRentAmount),
    //             rentPaidAmount: parseFloat(amountToPay),
    //             paymentModeId: parseInt(paymentModeId),
    //             remarks: remarks,
    //             monthYear: document.querySelector('input[type="month"]').value,
    //         }
    //     };

    //     try {
    //         const response = await fetch(`${ApiBaseUrl}/rent/save/rent-log`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'userId': userId,
    //             },
    //             body: JSON.stringify(requestBody),
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             if (data?.statusDescription?.statusCode === 200) {
    //                 toast.success(data.description || 'Rent log submitted successfully');
    //                 // Optionally reset form here
    //             } else {
    //                 toast.error(data?.statusDescription?.description || 'Failed to save rent log');
    //             }
    //         } else {
    //             toast.error('Submission failed: ' + response.status);
    //         }
    //     } catch (error) {
    //         toast.error('Error submitting rent log: ' + error.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        if (!selectedLesseeId || !selectedRentAmount || !paymentModeId || !amountToPay) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!userId) {
            toast.error('User ID is missing in localStorage');
            return;
        }

        // Get selected lessee and payment mode details
        const selectedLessee = lesseeDetails.find(l => l.id === parseInt(selectedLesseeId));
        const selectedMode = paymentMode.find(m => m.id === parseInt(paymentModeId));

        if (!selectedLessee || !selectedMode) {
            toast.error('Selected lessee or payment mode not found');
            return;
        }

        const requestBody = {
            monthlyRentLog: {
                lesseeId: parseInt(selectedLesseeId),
                lesseeName: selectedLessee.name,
                rentAmount: parseFloat(selectedRentAmount),
                rentPaidAmount: parseFloat(amountToPay),
                paymentModeId: parseInt(paymentModeId),
                paymentMode: selectedMode.name,
                remarks: remarks,
                monthYear: document.querySelector('input[type="month"]').value,
            }
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/save/rent-log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok && data?.statusDescription?.statusCode === 200) {
                toast.success(data?.description || 'Rent log submitted successfully');
            } else {
                toast.error(data?.statusDescription?.description || 'Failed to save rent log');
            }
        } catch (error) {
            toast.error('Error submitting rent log: ' + error.message);
        }
    };


    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Rent Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Lessee</label>
                                            <select
                                                className="form-select"
                                                value={selectedLesseeId}
                                                onChange={handleLesseeChange}
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
                                            <label className="form-label">Monthly Rent Amount</label>
                                            <select
                                                className="form-select"
                                                value={selectedRentAmount}
                                                onChange={handleRentAmountChange}
                                            >
                                                <option value="">Select Rent Amount</option>
                                                {rentAmounts.length === 0 ? (
                                                    <option>No rent agreement available</option>
                                                ) : (
                                                    rentAmounts.map(amount => (
                                                        <option key={amount} value={amount}>
                                                            ₹{amount.toLocaleString()}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>

                                        {/* <div className="col-md-3">
                                            <label className="form-label">Monthly Rent Amount</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    rentAmounts.length > 0
                                                        ? `₹${rentAmounts[0].toLocaleString()}`
                                                        : 'No rent agreement available'
                                                }
                                                readOnly
                                            />
                                        </div> */}
                                        <div className="col-md-3">
                                            <label className="form-label">Month & Year</label>
                                            <input type="month" className="form-control" required />
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
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Amount To Pay</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={amountToPay}
                                                onChange={handleAmountToPayChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label">Pending Rent</label>
                                            <input type="text" className="form-control" value="0" readOnly />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Remarks</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={remarks}
                                                onChange={handleRemarksChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary">Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AddRent;
