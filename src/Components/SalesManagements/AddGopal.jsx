import React, { useState } from 'react';

const AddGopal = () => {
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (e) => {
        setSelectedType(e.target.value);
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Gopal Sales Details</h5>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Select Cashier Type</label>
                                            <select
                                                className="form-select"
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
                                                    <input type="date" className="form-control" required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Cash Sale</label>
                                                    <input type="text" className="form-control" required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Card Sale / Online Order</label>
                                                    <input type="text" className="form-control" required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Void Bill Amt</label>
                                                    <input type="text" className="form-control" required />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="form-label">Sub Total</label>
                                                    <input type="text" className="form-control" required />
                                                </div>
                                            </div>
                                        </>
                                    )}

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

export default AddGopal;
