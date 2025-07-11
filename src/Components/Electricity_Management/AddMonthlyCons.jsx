import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { useNavigate } from 'react-router-dom';

const AddMonthlyCons = () => {

    const [formData, setFormData] = useState({
        monthYear: '',
        unit: '',
        solarUnit: '',
        dsrBill: '',
        postpaidBill: '',
        collectionAmountPostpaid: '',
        collectionAmountPrepaid: '',
        totalAmount: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        const postpaid = parseFloat(updatedFormData.collectionAmountPostpaid) || 0;
        const prepaid = parseFloat(updatedFormData.collectionAmountPrepaid) || 0;

        if (name === 'collectionAmountPostpaid' || name === 'collectionAmountPrepaid') {
            updatedFormData.totalAmount = (postpaid + prepaid).toFixed(2);
        }

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('User ID not found in localStorage.');
            return;
        }

        const payload = {
            meterReadingLog: {
                monthYear: formData.monthYear,
                unit: parseFloat(formData.unit),
                solarUnit: parseFloat(formData.solarUnit),
                dsrBill: parseFloat(formData.dsrBill),
                postpaidBill: parseFloat(formData.postpaidBill),
                collectionAmountPostpaid: parseFloat(formData.collectionAmountPostpaid),
                collectionAmountPrepaid: parseFloat(formData.collectionAmountPrepaid),
                totalAmount: parseFloat(formData.totalAmount)
            }
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/meter-log/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result?.statusDescription?.description || 'Monthly consumption data submitted successfully!');
                handleReset();
                setTimeout(() => {
                    navigate('/viewElecCons');
                }, 3000);
            } else {
                toast.error(result.statusDescription?.description || 'Submission failed.');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    const handleReset = () => {
        setFormData({
            monthYear: '',
            unit: '',
            solarUnit: '',
            dsrBill: '',
            postpaidBill: '',
            collectionAmountPostpaid: '',
            collectionAmountPrepaid: '',
            totalAmount: ''
        });
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Monthly Consumption Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
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
                                            <label className="form-label">No of Units Consumed</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Solar Units Consumed</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="solarUnit"
                                                value={formData.solarUnit}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">DSR Bill After Fixed Charges</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="dsrBill"
                                                value={formData.dsrBill}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Postpaid Bill Generation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="postpaidBill"
                                                value={formData.postpaidBill}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Collection Details (A)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="collectionAmountPostpaid"
                                                value={formData.collectionAmountPostpaid}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Prepaid Collection (B)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="collectionAmountPrepaid"
                                                value={formData.collectionAmountPrepaid}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Grand Total (A+B)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="totalAmount"
                                                value={formData.totalAmount}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handleReset} >Reset</button>
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

export default AddMonthlyCons;