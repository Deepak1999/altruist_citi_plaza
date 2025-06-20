// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Chart,
//     LineController,
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     Tooltip,
//     Legend,
//     Title
// } from 'chart.js';

// Chart.register(
//     LineController,
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     Tooltip,
//     Legend,
//     Title
// );

// const DashboardCoupons = () => {

//     const chartRef = useRef(null);
//     const chartInstance = useRef(null);
//     const [showRentDropdown, setShowRentDropdown] = useState(false);

//     useEffect(() => {
//         const ctx = chartRef.current.getContext('2d');

//         if (chartInstance.current) {
//             chartInstance.current.destroy();
//         }

//         chartInstance.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//                 datasets: [
//                     {
//                         label: 'Add Balance',
//                         data: [120, 150, 180, 140, 200, 160, 190],
//                         borderColor: '#4caf50',
//                         fill: false,
//                         tension: 0.3,
//                     },
//                     {
//                         label: 'Consumed Balance',
//                         data: [100, 120, 90, 130, 150, 170, 160],
//                         borderColor: '#f44336',
//                         fill: false,
//                         tension: 0.3,
//                     },
//                     {
//                         label: 'Available Balance',
//                         data: [20, 30, 90, 10, 50, 10, 30],
//                         borderColor: '#2196f3',
//                         fill: false,
//                         tension: 0.3,
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Balance Summary (Monthly)',
//                     },
//                     legend: {
//                         position: 'top',
//                     },
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                     },
//                 },
//             },
//         });

//         return () => {
//             chartInstance.current.destroy();
//         };
//     }, []);

//     const updateCuponsChart = (rangeLabel) => {
//         // setGopalAyaanCimenaFilter(rangeLabel);
//         setShowRentDropdown(false);

//         const periodMap = {
//             '3Month': 3,
//             '6Month': 6,
//             '9Month': 9,
//             '12Month': 12,
//         };

//         const period = periodMap[rangeLabel];
//         if (period) {
//             // fetchGopalAyaanCinemaData(period);
//         }
//     };

//     return (
//         <div className="col-lg-6">
//             <div className="card">
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <h5 className="card-title">Coupon Balance Summary</h5>
//                         <div style={{ position: 'relative' }}>
//                             <i
//                                 className="fa-solid fa-filter"
//                                 style={{ cursor: 'pointer' }}
//                                 onClick={() => setShowRentDropdown(!showRentDropdown)}
//                             ></i>
//                             {showRentDropdown && (
//                                 <div
//                                     className="dropdown-menu show"
//                                     style={{
//                                         position: 'absolute',
//                                         top: '100%',
//                                         right: 0,
//                                         zIndex: 1000,
//                                     }}
//                                 >
//                                     {['3Month', '6Month', '9Month', '12Month'].map((range) => (
//                                         <button
//                                             key={range}
//                                             className="dropdown-item"
//                                             onClick={() => updateCuponsChart(range)}
//                                         >
//                                             {range}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <canvas
//                         ref={chartRef}
//                         style={{ maxHeight: '400px', width: '100%' }}
//                     ></canvas>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardCoupons;


import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

Chart.register(
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title
);

const DashboardCoupons = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('3Month');

    const periodMap = {
        '3Month': 3,
        '6Month': 6,
        '9Month': 9,
        '12Month': 12,
    };

    const fetchCouponData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.warn('userId not found in localStorage');
            return;
        }

        try {
            const response = await fetch(
                `${ApiBaseUrl}/dashboard/coupon-log-summary?period=${period}`,
                {
                    headers: {
                        userId: userId,
                    },
                }
            );

            const result = await response.json();
            const rawData = result.data || {};

            const months = Object.keys(rawData).sort();
            const couponAdded = [];
            const couponConsumed = [];
            const couponBalance = [];

            months.forEach((month) => {
                const entry = rawData[month];
                couponAdded.push(parseFloat(entry.couponAdded || 0));
                couponConsumed.push(parseFloat(entry.couponConsumed || 0));
                couponBalance.push(parseFloat(entry.couponBalance || 0));
            });

            updateChart(months, couponAdded, couponConsumed, couponBalance);
        } catch (error) {
            console.error('Error fetching coupon data:', error);
        }
    };

    const updateChart = (labels, added, consumed, balance) => {
        const ctx = chartRef.current.getContext('2d');
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Coupon Added',
                        data: added,
                        borderColor: '#4caf50',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Consumed',
                        data: consumed,
                        borderColor: '#f44336',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Balance',
                        data: balance,
                        borderColor: '#2196f3',
                        fill: false,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Coupon Balance Summary`,
                    },
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    const handlePeriodChange = (label) => {
        setSelectedPeriod(label);
        setShowDropdown(false);
        const period = periodMap[label];
        if (period) {
            fetchCouponData(period);
        }
    };

    useEffect(() => {
        fetchCouponData(periodMap[selectedPeriod]);
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Coupon Balance Summary</h5>
                        <div style={{ position: 'relative' }}>
                            <i
                                className="fa-solid fa-filter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)}
                            ></i>
                            {showDropdown && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        zIndex: 1000,
                                    }}
                                >
                                    {Object.keys(periodMap).map((range) => (
                                        <button
                                            key={range}
                                            className="dropdown-item"
                                            onClick={() => handlePeriodChange(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <canvas
                        ref={chartRef}
                        style={{ maxHeight: '400px', width: '100%' }}
                    ></canvas>
                </div>
            </div>
        </div>
    );
};

export default DashboardCoupons;