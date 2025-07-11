import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { useNavigate } from 'react-router-dom';

const AddAyaanCinema = () => {

    const [formData, setFormData] = useState({
        reportDate: "",
        boxOfficeAdmits: "",
        netBoxOfficeSales: "",
        grossBoxOfficeSales: "",
        netConcessionsSales: "",
        grossConcessionsSales: "",
        dsrShareNetBoxOffice: "",
        dsrShareNetConcessions: "",
        totalDsrShare: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedFormData = {
            ...formData,
            [name]: value,
        };

        const netBoxOffice = parseFloat(updatedFormData.netBoxOfficeSales) || 0;
        const netConcessions = parseFloat(updatedFormData.netConcessionsSales) || 0;

        const dsrShareNetBoxOffice = (netBoxOffice * 0.18).toFixed(2);
        const dsrShareNetConcessions = (netConcessions * 0.18).toFixed(2);

        const totalDsrShare = Math.round(
            parseFloat(dsrShareNetBoxOffice) + parseFloat(dsrShareNetConcessions)
        );

        setFormData({
            ...updatedFormData,
            dsrShareNetBoxOffice,
            dsrShareNetConcessions,
            totalDsrShare,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        const now = new Date();
        const timePart = now.toTimeString().split(" ")[0];
        const reportDateTime = `${formData.reportDate} ${timePart}`;

        try {
            const response = await fetch(`${ApiBaseUrl}/sale-logs/box-office-concession/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        userId: userId,
                    },
                    body: JSON.stringify({
                        boxOfficeConcessionSales: {
                            ...formData,
                            reportDate: reportDateTime
                        }
                    })
                }
            );

            const result = await response.json();

            if (response.ok && result.statusDescription?.statusCode === 200) {
                toast.success(result?.statusDescription?.description || "Data saved successfully!");
                handleReset();
                setTimeout(() => {
                    navigate('/viewAyaanSales');
                }, 3000);
            } else {
                toast.error(result.statusDescription?.description || "Save failed");
            }
        } catch (error) {
            toast.error("API error: " + error.message);
        }
    };

    const handleReset = () => {
        setFormData({
            reportDate: "",
            boxOfficeAdmits: "",
            netBoxOfficeSales: "",
            grossBoxOfficeSales: "",
            netConcessionsSales: "",
            grossConcessionsSales: "",
            dsrShareNetBoxOffice: "",
            dsrShareNetConcessions: "",
            totalDsrShare: "",
        });
    }

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Ayaan Sales Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="reportDate"
                                                value={formData.reportDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Box Office Admits</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="boxOfficeAdmits"
                                                value={formData.boxOfficeAdmits}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Net Box Office Sales</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="netBoxOfficeSales"
                                                value={formData.netBoxOfficeSales}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Gross Box Office Sales</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="grossBoxOfficeSales"
                                                value={formData.grossBoxOfficeSales}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Net Concessions Sales</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="netConcessionsSales"
                                                value={formData.netConcessionsSales}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Gross Concessions Sales</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="grossConcessionsSales"
                                                value={formData.grossConcessionsSales}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">DSR Share on net Box Off. Sales(A)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="dsrShareNetBoxOffice"
                                                value={formData.dsrShareNetBoxOffice}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">DSR Share on net Concession(B)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="dsrShareNetConcessions"
                                                value={formData.dsrShareNetConcessions}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Total(A+B)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="totalDsrShare"
                                                value={formData.totalDsrShare}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">
                                            Submit
                                        </button>
                                        <button type="reset" className="btn btn-secondary" onClick={handleReset}>
                                            Reset
                                        </button>
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

export default AddAyaanCinema;