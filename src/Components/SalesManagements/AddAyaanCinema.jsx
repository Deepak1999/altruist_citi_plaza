import React from 'react';

const AddAyaanCinema = () => {
    return (
        <main id="main" className="main">
            <section className="section dashboard d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <img
                        src="/assets/img/comingsoon.jpg"
                        alt="Coming Soon"
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    <h2>Coming Soon</h2>
                    <p>This feature is under development. Stay tuned!</p>
                </div>
            </section>
        </main>
    );
};

export default AddAyaanCinema;
