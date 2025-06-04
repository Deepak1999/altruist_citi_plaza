import React from 'react';

const TataPower = () => {
    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Tata Power</h5>
                                <img
                                    src="/assets/img/comingsoon.jpg"
                                    alt="Under Development"
                                    style={{ maxWidth: '300px', width: '100%', marginBottom: '20px' }}
                                />
                                <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                                    🚧 This page is currently under development. Stay tuned!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TataPower;
