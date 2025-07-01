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
    const [selectedPeriod, setSelectedPeriod] = useState('6Month');
    const [filterType, setFilterType] = useState('6Month');
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
        'Current Month': 11,
        'Prev Month': 13,
        '3Month': 3,
        '6Month': 6,
        '9Month': 9,
        '12Month': 12,
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
            const rows = Object.entries(data).map(([id, value]) => ({
                id,
                value
            }));

            const modalLabels = {
                1: 'Coupon Added',
                2: 'Coupon Consumed',
                3: 'Coupon Balance',
            };

            setModalTitle(`${modalLabels[category]} • ${yearMonth}`);
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
                        data: added,
                        borderColor: '#4caf50',
                        backgroundColor: '#4caf50',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Consumed',
                        data: consumed,
                        borderColor: '#f44336',
                        backgroundColor: '#f44336',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        label: 'Coupon Balance',
                        data: balance,
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
                    // legend: {
                    //     position: 'top',
                    // },
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
