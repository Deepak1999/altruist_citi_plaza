import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const DashboardGopalAyaanSaleTrends = () => {
    const [showRentDropdown, setShowRentDropdown] = useState(false);
    const [gopalAyaanCinemaFilter, setGopalAyaanCimenaFilter] = useState('3Month');
    const lineChartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const fetchGopalAyaanCinemaData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.warn("userId not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/sale-log-summary?period=${period}`,
                {
                    headers: {
                        'userId': userId,
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to fetch Gopal & Ayaan summary');

            const result = await response.json();
            const gopalAyaanDetails = result.dashboardSalesLogDetails || {};

            const months = Object.keys(gopalAyaanDetails).sort();

            const gopalAmount = [];
            const ayaanAmount = [];
            const gopalAtplShare = [];
            const ayaanAtplShare = [];

            months.forEach((month) => {
                const data = gopalAyaanDetails[month];
                gopalAmount.push(parseFloat(data.gopalAmount));
                ayaanAmount.push(parseFloat(data.ayaanAmount));
                gopalAtplShare.push(parseFloat(data.gopalAtplShare));
                ayaanAtplShare.push(parseFloat(data.ayaanAtplShare));
            });

            const option = {
                title: { text: 'Sales Trend & Share', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['Gopal Sale', 'Ayaan Sale', 'Gopal Atpl Share', 'Ayaan Atpl Share'],
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
                        name: 'Gopal Sale',
                        type: 'line',
                        smooth: true,
                        data: gopalAmount,
                        lineStyle: {
                            color: '#9c64f3',
                        },
                        itemStyle: { color: '#9c64f3' },
                    },
                    {
                        name: 'Ayaan Sale',
                        type: 'line',
                        smooth: true,
                        data: ayaanAmount,
                        lineStyle: {
                            color: '#4caf50',
                        },
                        itemStyle: { color: '#4caf50' },

                    },
                    {
                        name: 'Gopal Atpl Share',
                        type: 'line',
                        smooth: true,
                        data: gopalAtplShare,
                        lineStyle: {
                            color: '#4caf50',
                        },
                        itemStyle: { color: '#4caf50' },

                    },
                    {
                        name: 'Ayaan Atpl Share',
                        type: 'line',
                        smooth: true,
                        data: ayaanAtplShare,
                        lineStyle: {
                            color: '#4caf50',
                        },
                        itemStyle: { color: '#4caf50' },

                    },
                ],
            };

            chartInstanceRef.current.setOption(option);
        } catch (error) {
            console.error('Error fetching Gopal & Ayaan data:', error);
        }
    };

    const updateGopalAyaanChart = (rangeLabel) => {
        setGopalAyaanCimenaFilter(rangeLabel);
        setShowRentDropdown(false);

        const periodMap = {
            '3Month': 3,
            '6Month': 6,
            '9Month': 9,
            '12Month': 12,
        };

        const period = periodMap[rangeLabel];
        if (period) {
            fetchGopalAyaanCinemaData(period);
        }
    };

    useEffect(() => {
        const chart = echarts.init(lineChartRef.current);
        chartInstanceRef.current = chart;

        window.addEventListener('resize', chart.resize);

        fetchGopalAyaanCinemaData(3);

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
                        <h5 className="card-title">Gopal & Ayaan Cinema Sale Summary</h5>
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
                                            onClick={() => updateGopalAyaanChart(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        ref={lineChartRef}
                        style={{ width: '100%', height: '300px', marginTop: '15px' }}
                    ></div>

                    <div className="d-flex justify-content-around text-center">
                        <div>
                            <h6>Total Gopal</h6>
                            <p className="mb-0">$10,000</p>
                        </div>
                        <div>
                            <h6>Total Ayaan</h6>
                            <p className="mb-0">$7,500</p>
                        </div>
                        <div>
                            <h6>Total Gopal Atpl Sahre</h6>
                            <p className="mb-0">$2,500</p>
                        </div>
                        <div>
                            <h6>Total Ayaan Atpl Sahre</h6>
                            <p className="mb-0">$2,500</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardGopalAyaanSaleTrends;