import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const Dashboard = () => {

    const doughnutRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const dateTime = new Date().toLocaleDateString('en-CA');
    const [filter, setFilter] = useState('3M');
    const [showDropdown, setShowDropdown] = useState(false);
    const [openingBalance, setopeningBalance] = useState("0");
    const [closingBalance, setclosingBalance] = useState("0");

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

    const handleGetOpeningClosingBalance = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/opening-closing-balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, description } = data.statusDescription;

                if (statusCode === 200) {
                    setopeningBalance(parseFloat(data.dashboardOpeningBalance));
                    setclosingBalance(parseFloat(data.dashboardClosingBalance));
                } else {
                    toast.error(description || 'Failed to fetch balance data');
                }
            } else {
                toast.error('Failed to fetch data. Status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching balance data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetBankBalanceData();
        handleGetOpeningClosingBalance();
    }, []);

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

    const rentChartRef = useRef(null);
    const electricityChartRef = useRef(null);
    const lineChartRef = useRef(null);

    useEffect(() => {
        const rentChartInstance = echarts.init(rentChartRef.current);
        const electricityChartInstance = echarts.init(electricityChartRef.current);
        const chartInstance = echarts.init(lineChartRef.current);

        const rentOption = {
            title: {
                text: 'Rent Summary',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['Total Rent', 'Rent Collected', 'Rent Pending'],
                top: 25,
            },
            xAxis: {
                type: 'category',
                data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'Total Rent',
                    type: 'bar',
                    data: [69, 79, 89, 99, 111, 131, 151],
                    itemStyle: {
                        color: '#4caf50',
                    },
                },
                {
                    name: 'Rent Collected',
                    type: 'bar',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    itemStyle: {
                        color: '#0baade',
                    },
                },
                {
                    name: 'Rent Pending',
                    type: 'bar',
                    data: [10, 20, 5, 15, 8, 12, 6],
                    itemStyle: {
                        color: '#ff9800',
                    },
                },
            ],
        };

        const electricityOption = {
            title: {
                text: 'Electricity Summary',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['Amount Paid', 'Postpaid Amount', 'Prepaid Amount'],
                top: 25,
            },
            xAxis: {
                type: 'category',
                data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'Amount Paid',
                    type: 'bar',
                    data: [120, 132, 101, 134, 90, 230, 210],
                    itemStyle: {
                        color: '#4caf50',
                    },
                },
                {
                    name: 'Postpaid Amount',
                    type: 'bar',
                    data: [220, 182, 191, 234, 290, 330, 310],
                    itemStyle: {
                        color: '#ff9800',
                    },
                },
                {
                    name: 'Prepaid Amount',
                    type: 'bar',
                    data: [150, 232, 201, 154, 190, 330, 410],
                    itemStyle: {
                        color: '#2196f3',
                    },
                },
            ],
        };

        const option = {
            title: {
                text: 'Sales Trend & Share',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['Gopal', 'Ayaan Cinema', 'Altruist Share'],
                top: 25,
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'Gopal',
                    type: 'line',
                    smooth: true,
                    data: [120, 132, 101, 134, 90, 230, 210],
                    lineStyle: {
                        color: '#4caf50',
                    },
                    itemStyle: {
                        color: '#4caf50',
                    },
                },
                {
                    name: 'Ayaan Cinema',
                    type: 'line',
                    smooth: true,
                    data: [220, 182, 191, 234, 290, 330, 310],
                    lineStyle: {
                        color: '#ff9800',
                    },
                    itemStyle: {
                        color: '#ff9800',
                    },
                },
                {
                    name: 'Altruist Share',
                    type: 'line',
                    smooth: true,
                    data: [15, 15, 15, 15, 15, 15, 15],
                    lineStyle: { color: '#2196f3' },
                },
            ],
        };

        rentChartInstance.setOption(rentOption);
        electricityChartInstance.setOption(electricityOption);
        chartInstance.setOption(option);

        const handleResize = () => {
            rentChartInstance.resize();
            electricityChartInstance.resize();
            chartInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            rentChartInstance.dispose();
            electricityChartInstance.dispose();
            chartInstance.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <main id="main" className="main">
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title" style={{ color: 'green' }}>
                                        Date: {dateTime}
                                        <br />
                                        Opening Balance : ₹{openingBalance}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title" style={{ color: 'blue' }}>
                                        Date: {dateTime}
                                        <br />
                                        Closing Balance : ₹{closingBalance}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Bank Balance</h5>
                                    <div
                                        ref={doughnutRef}
                                        style={{ width: '100%', height: '300px' }}
                                    ></div>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-lg-6">
                            <div className="card position-relative">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0">Bank Balance</h5>

                                        {/* Filter icon */}
                                        <div style={{ position: 'relative' }}>
                                            <i
                                                className="fa-solid fa-filter"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setShowDropdown(!showDropdown)}
                                            ></i>

                                            {/* Dropdown */}
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
                                    </div>

                                    <div
                                        ref={doughnutRef}
                                        style={{ width: '100%', height: '300px', marginTop: '15px' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Rent Summary</h5>
                                    <div ref={rentChartRef} style={{ width: '100%', height: '300px' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Electricity Summary</h5>
                                    <div ref={electricityChartRef} style={{ width: '100%', height: '300px' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Gopal & Ayaan Cinema Sale Summary</h5>
                                    <div ref={lineChartRef} style={{ width: '100%', height: '300px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Dashboard;