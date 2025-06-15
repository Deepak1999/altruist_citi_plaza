import React from 'react';
import ViewRent from '../Rent_Management/ViewRent';
import ViewMeterRecharge from '../Electricity_Management/ViewMeterRecharge';
import ViewMonthlyCons from '../Electricity_Management/ViewMonthlyCons';
import ViewGopal from '../SalesManagements/ViewGopal';
import ViewAyaanCinema from '../SalesManagements/ViewAyaanCinema';

const Dashboard = () => {
    return (
        <>
            <main id="main" className="main">
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Welcome To Altruist Citi Plaza !!</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ViewRent />
            <ViewMeterRecharge />
            <ViewMonthlyCons />
            <ViewGopal />
            <ViewAyaanCinema />
        </>
    );
};

export default Dashboard