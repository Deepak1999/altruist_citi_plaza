import React, { useState } from 'react';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddGopal = () => {
    const [selectedType, setSelectedType] = useState('');
    const [formData, setFormData] = useState({
        saleDate: '',
        cashSale: '',
        cardOnlineSale: '',
        voidBillAmount: '',
        subTotal: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'selectedType') {
            setSelectedType(value);
            return;
        }

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            const cash = parseFloat(updated.cashSale) || 0;
            const card = parseFloat(updated.cardOnlineSale) || 0;
            const voidAmt = parseFloat(updated.voidBillAmount) || 0;

            updated.subTotal = (cash + card + voidAmt).toFixed(2);

            return updated;
        });
    };

    const formatSaleDateWithTime = (dateStr) => {
        const date = new Date();
        const timePart = date.toTimeString().split(' ')[0];
        return `${dateStr} ${timePart}`;
    };

    const formattedDateTime = formatSaleDateWithTime(formData.saleDate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary user information');
            return;
        }

        const payload = {
            gopalSaleLogs: {
                cashierName:
                    selectedType === '1'
                        ? 'Restaurant'
                        : selectedType === '2'
                            ? 'Sweets'
                            : 'Other',
                ...formData,
                saleDate: formattedDateTime
            }
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/sale-logs/gopal/save`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'UserId': userId
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            if (response.ok && result?.statusDescription?.statusCode === 200) {
                toast.success(result?.statusDescription.description || 'Details submitted successfully!');
                handleReset();
                setTimeout(() => {
                    navigate('/viewGopalSales');
                }, 3000);
            } else {
                toast.error(result.statusDescription?.description || 'Submission failed');
            }
        } catch (error) {
            toast.error('Error submitting data: ' + error.message);
        }
    };

    const handleReset = () => {
        setSelectedType('');
        setFormData({
            saleDate: '',
            cashSale: '',
            cardOnlineSale: '',
            voidBillAmount: '',
            subTotal: ''
        });
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Gopal Sales Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Select Cashier Type</label>
                                            <select
                                                className="form-select"
                                                name="selectedType"
                                                value={selectedType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="1">Restaurant</option>
                                                <option value="2">Sweets</option>
                                                <option value="3">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(selectedType === '1' || selectedType === '2') && (
                                        <>
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="form-label">Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="saleDate"
                                                        value={formData.saleDate}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Cash Sale</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="cashSale"
                                                        value={formData.cashSale}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Card Sale / Online Order</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="cardOnlineSale"
                                                        value={formData.cardOnlineSale}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Void Bill Amt</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="voidBillAmount"
                                                        value={formData.voidBillAmount}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="form-label">Sub Total</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="subTotal"
                                                        value={formData.subTotal}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

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

export default AddGopal;
