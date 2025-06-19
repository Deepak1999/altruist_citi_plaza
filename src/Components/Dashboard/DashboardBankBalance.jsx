import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as echarts from 'echarts';
const DashboardBankBalance = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const doughnutRef = useRef(null);
    const [filter, setFilter] = useState('3M');
    const [chartData, setChartData] = useState([]);

    const handleGetBankBalanceData = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing userId in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/bank-summary/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, statusMessage } = data.statusDescription;

                if (statusCode === 200) {
                    const summary = data.dailyBankSummary || [];

                    if (!summary.length) {
                        toast.info('No data available');
                        return;
                    }

                    const sorted = summary.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const latest = sorted[0];

                    const formatted = [];

                    if (latest.bankBalance !== null) {
                        formatted.push({ value: latest.bankBalance, name: 'Bank Balance' });
                    }
                    if (latest.mobisoft !== null) {
                        formatted.push({ value: latest.mobisoft, name: 'Mobisoft' });
                    }
                    if (latest.atpl !== null) {
                        formatted.push({ value: latest.atpl, name: 'Atpl' });
                    }
                    if (latest.rsHospitality !== null) {
                        formatted.push({ value: latest.rsHospitality, name: 'RS Hospitality' });
                    }
                    if (latest.netBalance !== null) {
                        formatted.push({ value: latest.netBalance, name: 'Net Balance' });
                    }

                    setChartData(formatted);
                } else {
                    toast.error(statusMessage || 'Failed to fetch data');
                }
            } else {
                toast.error('Failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    useEffect(() => {
        if (!chartData.length) return;

        const chartDom = doughnutRef.current;
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: 'Latest Bank Distribution',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                // formatter: '{b}: ₹{c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                top: 'bottom',
                left: 'center',
            },
            series: [
                {
                    name: 'Bank Allocation',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', myChart.resize);

        return () => {
            window.removeEventListener('resize', myChart.resize);
            myChart.dispose();
        };
    }, [chartData]);

    useEffect(() => {
        handleGetBankBalanceData();
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card position-relative">
                <div className="card-body">
                    <h5 className="card-title mb-0">Bank Balance</h5>
                    {/* <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Bank Balance</h5>

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
                                        display: 'block',
                                    }}
                                >
                                    {['3Month', '6Month', '9Month'].map((range) => (
                                        <button
                                            key={range}
                                            className="dropdown-item"
                                            onClick={() => {
                                                setFilter(range);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div> */}

                    <div
                        ref={doughnutRef}
                        style={{ width: '100%', height: '300px', marginTop: '15px' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardBankBalance