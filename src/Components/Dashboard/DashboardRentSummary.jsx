import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const DashboardRentSummary = () => {
    const [showRentDropdown, setShowRentDropdown] = useState(false);
    const [rentFilter, setRentFilter] = useState('3Month');
    const rentChartRef = useRef(null);
    const rentChartInstanceRef = useRef(null);

    const fetchRentData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.warn("userId not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/rent-summary?period=${period}`,
                {
                    headers: {
                        'userId': userId,
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to fetch rent summary');

            const result = await response.json();
            const rentDetails = result.dashboardRentSummaryDetails || {};

            const months = Object.keys(rentDetails).sort();

            const totalRent = [];
            const rentPaid = [];
            const rentPending = [];

            months.forEach((month) => {
                const data = rentDetails[month];
                totalRent.push(parseFloat(data.totalRentAmount));
                rentPaid.push(parseFloat(data.rentPaid));
                rentPending.push(parseFloat(data.rentPending));
            });

            const option = {
                title: { text: 'Rent Summary', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['Total Rent', 'Rent Collected', 'Rent Pending'],
                    top: 25,
                },
                xAxis: {
                    type: 'category',
                    data: months,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Total Rent',
                        type: 'bar',
                        data: totalRent,
                        itemStyle: { color: '#4caf50' },
                    },
                    {
                        name: 'Rent Collected',
                        type: 'bar',
                        data: rentPaid,
                        itemStyle: { color: '#0baade' },
                    },
                    {
                        name: 'Rent Pending',
                        type: 'bar',
                        data: rentPending,
                        itemStyle: { color: '#ff9800' },
                    },
                ],
            };

            rentChartInstanceRef.current.setOption(option);
        } catch (error) {
            console.error('Error fetching rent data:', error);
        }
    };

    const updateRentChart = (rangeLabel) => {
        setRentFilter(rangeLabel);
        setShowRentDropdown(false);

        const periodMap = {
            '3Month': 3,
            '6Month': 6,
            '9Month': 9,
            '12Month': 12,
        };

        const period = periodMap[rangeLabel];
        if (period) {
            fetchRentData(period);
        }
    };

    useEffect(() => {
        const chart = echarts.init(rentChartRef.current);
        rentChartInstanceRef.current = chart;

        window.addEventListener('resize', chart.resize);

        fetchRentData(3);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', chart.resize);
        };
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Rent Summary</h5>
                        <div style={{ position: 'relative' }}>
                            <i
                                className="fa-solid fa-filter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowRentDropdown(!showRentDropdown)}
                            ></i>
                            {showRentDropdown && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        zIndex: 1000,
                                    }}
                                >
                                    {['3Month', '6Month', '9Month', '12month'].map((range) => (
                                        <button
                                            key={range}
                                            className="dropdown-item"
                                            onClick={() => updateRentChart(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        ref={rentChartRef}
                        style={{ width: '100%', height: '300px', marginTop: '15px' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardRentSummary;