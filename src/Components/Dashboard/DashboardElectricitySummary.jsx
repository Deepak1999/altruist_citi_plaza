import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const DashboardElectricitySummary = () => {
    
    const electricityChartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [showRentDropdown, setShowRentDropdown] = useState(false);
    const [electricityFilter, setElectricityFilter] = useState('3Month');

    const fetchElectricityData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.warn("userId not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=${period}`,
                {
                    headers: {
                        'userId': userId,
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to fetch electricity summary');

            const result = await response.json();
            const electricityDetails = result.dashboardElectricitySummaryDetails || {};

            const months = Object.keys(electricityDetails).sort();

            const totalBilledAmount = [];
            const totalPaidAmount = [];
            const postPaidAmount = [];
            const prePaidAmount = [];

            months.forEach((month) => {
                const data = electricityDetails[month];
                totalBilledAmount.push(parseFloat(data.totalBilledAmount));
                totalPaidAmount.push(parseFloat(data.totalPaidAmount));
                postPaidAmount.push(parseFloat(data.postPaidAmount));
                prePaidAmount.push(parseFloat(data.prePaidAmount));
            });

            const option = {
                title: { text: 'Electricity Summary', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['Billed Amount', 'Paid Amount', 'Postpaid Amount', 'Prepaid Amount'],
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
                        name: 'Billed Amount',
                        type: 'bar',
                        data: totalBilledAmount,
                        itemStyle: { color: '#de0b8b' },
                    },
                    {
                        name: 'Paid Amount',
                        type: 'bar',
                        data: totalPaidAmount,
                        itemStyle: { color: '#4caf50' },
                    },
                    {
                        name: 'Postpaid Amount',
                        type: 'bar',
                        data: postPaidAmount,
                        itemStyle: { color: '#0baade' },
                    },
                    {
                        name: 'Prepaid Amount',
                        type: 'bar',
                        data: prePaidAmount,
                        itemStyle: { color: '#ff9800' },
                    },
                ],
            };

            chartInstanceRef.current.setOption(option);
        } catch (error) {
            console.error('Error fetching electricity data:', error);
        }
    };

    const updateElectricityChart = (rangeLabel) => {
        setElectricityFilter(rangeLabel);
        setShowRentDropdown(false);

        const periodMap = {
            '3Month': 3,
            '6Month': 6,
            '9Month': 9,
            '12Month': 12,
        };

        const period = periodMap[rangeLabel];
        if (period) {
            fetchElectricityData(period);
        }
    };

    useEffect(() => {
        const chart = echarts.init(electricityChartRef.current);
        chartInstanceRef.current = chart;

        window.addEventListener('resize', chart.resize);

        fetchElectricityData(3);

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
                        <h5 className="card-title">Electricity Summary</h5>
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
                                    {['3Month', '6Month', '9Month', '12Month'].map((range) => (
                                        <button
                                            key={range}
                                            className="dropdown-item"
                                            onClick={() => updateElectricityChart(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        ref={electricityChartRef}
                        style={{ width: '100%', height: '300px', marginTop: '15px' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardElectricitySummary;
