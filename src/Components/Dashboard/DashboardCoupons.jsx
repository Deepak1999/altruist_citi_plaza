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
import { toast } from 'react-toastify';

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
    const [selectedPeriod, setSelectedPeriod] = useState('3 Months');
    const [filterType, setFilterType] = useState('3 Months');
    const [totalCouponsSummaryData, setTotalCouponsSummaryData] = useState({
        couponAdded: 0,
        couponConsumed: 0,
        couponBalance: 0,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    const periodMap = {
        'YoY': -1,
        // 'MoM': -3,
        // 'Current Month': '0',
        // 'Prev Month': -2,
        '3 Months': 3,
        '6 Months': 6,
        '9 Months': 9,
        '12 Months': 12,
    };

    const fetchCouponData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/coupon-log-summary?period=${period}`, {
                headers: { userId },
            });

            const result = await response.json();
            const rawData = result.data || {};
            setTotalCouponsSummaryData(result.totalData || {});
            const months = Object.keys(rawData).sort();
            const couponAdded = [];
            const couponConsumed = [];
            const couponBalance = [];

            months.forEach(month => {
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

    const fetchDetails = async (category, yearMonth, label) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/consolidated-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId,
                },
                body: JSON.stringify({
                    group: 4,
                    category,
                    yearMonth,
                }),
            });

            const result = await response.json();
            const { statusCode, description } = result.statusDescription;

            if (statusCode !== 200) {
                toast.error(description || 'Failed to fetch detailed coupon data.');
                return;
            }

            const data = result.data || {};
            const nameMap = {
                1: 'Gopal Sweets',
                2: 'Pro Saloon'
            };
            const rows = Object.entries(data).map(([id, value]) => ({
                id: nameMap[id] || id,
                value
            }));

            const modalLabels = {
                1: 'Coupon Added',
                2: 'Coupon Consumed',
                3: 'Coupon Balance',
            };

            setModalTitle(`${modalLabels[category]} • ${formatYearMonth(yearMonth)}`);
            setModalColumns([
                { key: 'id', label: 'ID' },
                { key: 'value', label: modalLabels[category] },
            ]);
            setModalRows(rows);
            setModalVisible(true);
        } catch (error) {
            toast.error('Error fetching detailed data: ' + error.message);
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
                        // data: added,
                        data: added.map(val => Math.round(val)),
                        borderColor: '#4caf50',
                        backgroundColor: '#4caf50',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Consumed',
                        // data: consumed,
                        data: consumed.map(val => Math.round(val)),
                        borderColor: '#f44336',
                        backgroundColor: '#f44336',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Balance',
                        // data: balance,
                        data: balance.map(val => Math.round(val)),
                        borderColor: '#2196f3',
                        backgroundColor: '#2196f3',
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
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 8,
                            font: {
                                size: 11,
                            },
                        },
                    },
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                const rawLabel = context[0].label;
                                return customFormatDate(rawLabel);
                            },
                            label: function (context) {
                                const value = context.raw;
                                return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                if (value >= 1_00_00_000) return (value / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
                                if (value >= 1_00_000) return (value / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
                                if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                                return value;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const datasetIndex = elements[0].datasetIndex;
                        const index = elements[0].index;
                        const month = chartInstance.current.data.labels[index];
                        const seriesName = chartInstance.current.data.datasets[datasetIndex].label;
                        const categoryMap = {
                            'Coupon Added': '1',
                            'Coupon Consumed': '2',
                            'Coupon Balance': '3',
                        };
                        const category = categoryMap[seriesName];
                        fetchDetails(category, month, seriesName);
                    }
                },
            },
        });
    };

    function customFormatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (day === 1) {
            return `${monthNames[monthIndex]}`;
        }

        const suffix = getDaySuffix(day);
        return `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
    }

    function getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const formatYearMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const date = new Date(`${year}-${month}-01`);
        return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    };

    const handlePeriodChange = (label) => {
        setSelectedPeriod(label);
        setShowDropdown(false);
        setFilterType(label);
        const period = periodMap[label];
        if (period) fetchCouponData(period);
    };

    useEffect(() => {
        fetchCouponData(periodMap[selectedPeriod]);
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    const handleGetTotalCouponsSummary = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing userId in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/coupon-log-summary?period=-1`, {
                headers: {
                    'Content-Type': 'application/json',
                    userId,
                },
            });

            const result = await response.json();
            const { statusCode, description } = result.statusDescription;

            if (statusCode === 200) {
                // setTotalCouponsBalanceSummaryData(result.data || {});
            } else {
                toast.error(description || 'Failed to fetch coupons summary.');
            }
        } catch (error) {
            toast.error('Error fetching summary: ' + error.message);
        }
    };

    // useEffect(() => {
    //     handleGetTotalCouponsSummary();
    // }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Coupon Balance Summary</h5>
                        <strong>
                            <span style={{ marginLeft: '100px' }}>
                                {filterType && `${filterType}`}
                            </span>
                        </strong>

                        <div style={{ position: 'relative' }}>
                            <i
                                className="fa-solid fa-filter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)}
                            ></i>
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
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

                    <canvas ref={chartRef} style={{ maxHeight: '350px', width: '100%' }} />
                    <br />

                    <div className="d-flex justify-content-around text-center">
                        <div>
                            <h6>Coupon Added</h6>
                            <strong><p className="mb-0">₹{parseFloat(totalCouponsSummaryData.couponAdded || 0).toLocaleString('en-IN')}</p></strong>
                        </div>
                        <div>
                            <h6>Consumed</h6>
                            <strong><p className="mb-0">₹{parseFloat(totalCouponsSummaryData.couponConsumed || 0).toLocaleString('en-IN')}</p></strong>
                        </div>
                        <div>
                            <h6>Balance</h6>
                            <strong><p className="mb-0">₹{parseFloat(totalCouponsSummaryData.couponBalance || 0).toLocaleString('en-IN')}</p></strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {modalColumns.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {modalColumns.map((col) => (
                                                    <th key={col.key}>{col.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalRows.map((row, i) => (
                                                <tr key={i}>
                                                    {modalColumns.map((col) => (
                                                        <td key={col.key}>{row[col.key]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No data available for this selection.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardCoupons;