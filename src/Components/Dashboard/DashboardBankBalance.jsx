// import React, { useEffect, useRef, useState } from 'react'
// import { toast } from 'react-toastify';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
// import * as echarts from 'echarts';
// const DashboardBankBalance = () => {

//     const [showDropdown, setShowDropdown] = useState(false);
//     const doughnutRef = useRef(null);
//     const [filter, setFilter] = useState('3M');
//     const [chartData, setChartData] = useState([]);

//     const [latestBalances, setLatestBalances] = useState({
//         bankBalance: 0,
//         mobisoft: 0,
//         atpl: 0,
//         rsHospitality: 0,
//         netBalance: 0,
//     });

//     const handleGetBankBalanceData = async () => {
//         const userId = localStorage.getItem('userId');

//         if (!userId) {
//             toast.error('Missing userId in localStorage');
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/bank-summary/all`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     userId: userId,
//                 },
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const { statusCode, statusMessage } = data.statusDescription;

//                 if (statusCode === 200) {
//                     const summary = data.dailyBankSummary || [];

//                     if (!summary.length) {
//                         toast.info('No data available');
//                         return;
//                     }

//                     const sorted = summary.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//                     const latest = sorted[0];

//                     const formatted = [];

//                     if (latest.bankBalance !== null) {
//                         formatted.push({ value: latest.bankBalance, name: 'Bank Balance' });
//                     }
//                     if (latest.mobisoft !== null) {
//                         formatted.push({ value: latest.mobisoft, name: 'Mobisoft' });
//                     }
//                     if (latest.atpl !== null) {
//                         formatted.push({ value: latest.atpl, name: 'Atpl' });
//                     }
//                     if (latest.rsHospitality !== null) {
//                         formatted.push({ value: latest.rsHospitality, name: 'RS Hosp.' });
//                     }
//                     if (latest.netBalance !== null) {
//                         formatted.push({ value: latest.netBalance, name: 'Net Balance' });
//                     }

//                     setChartData(formatted);

//                     setLatestBalances({
//                         bankBalance: latest.bankBalance,
//                         mobisoft: latest.mobisoft,
//                         atpl: latest.atpl,
//                         rsHospitality: latest.rsHospitality,
//                         netBalance: latest.netBalance,
//                     });

//                 } else {
//                     toast.error(statusMessage || 'Failed to fetch data');
//                 }
//             } else {
//                 toast.error('Failed to fetch data with status: ' + response.status);
//             }
//         } catch (error) {
//             toast.error('Error fetching data: ' + error.message);
//         }
//     };

//     useEffect(() => {
//         if (!chartData.length) return;

//         const chartDom = doughnutRef.current;
//         const myChart = echarts.init(chartDom);

//         const option = {
//             title: {
//                 // text: 'Latest Bank Distribution',
//                 // left: 'center'
//             },
//             tooltip: {
//                 trigger: 'item',
//                 // formatter: '{b}: ₹{c} ({d}%)'
//             },
//             legend: {
//                 orient: 'horizontal',
//                 top: 'bottom',
//                 left: 'center',
//             },
//             series: [
//                 {
//                     name: 'Bank Allocation',
//                     type: 'pie',
//                     radius: ['50%', '70%'],
//                     avoidLabelOverlap: false,
//                     label: {
//                         show: false,
//                         position: 'center'
//                     },
//                     emphasis: {
//                         label: {
//                             show: true,
//                             fontSize: 18,
//                             fontWeight: 'bold'
//                         }
//                     },
//                     labelLine: {
//                         show: false
//                     },
//                     data: chartData
//                 }
//             ]
//         };

//         myChart.setOption(option);
//         window.addEventListener('resize', myChart.resize);

//         return () => {
//             window.removeEventListener('resize', myChart.resize);
//             myChart.dispose();
//         };
//     }, [chartData]);

//     useEffect(() => {
//         handleGetBankBalanceData();
//     }, []);

//     return (
//         <div className="col-lg-6">
//             <div className="card position-relative">
//                 <div className="card-body">
//                     <h5 className="card-title">Bank Balance -INR</h5>
//                     <div
//                         ref={doughnutRef}
//                         style={{ width: '100%', height: '300px', marginTop: '15px' }}
//                     ></div><br />

//                     <div className="d-flex justify-content-around text-center">
//                         <div>
//                             {/* <h6>Total</h6> */}
//                             <strong> <p className="mb-0" style={{ color: 'rgb(84 112 198)' }}>
//                                 ₹{latestBalances.bankBalance != null
//                                     ? Math.round(latestBalances.bankBalance).toLocaleString('en-IN')
//                                     : "---"}
//                             </p></strong>
//                         </div>
//                         <div>
//                             {/* <h6>Mobisoft</h6> */}
//                             <strong><p className="mb-0">
//                                 ₹{latestBalances.mobisoft != null
//                                     ? Number(latestBalances.mobisoft).toLocaleString('en-IN',)
//                                     : "---"}
//                             </p></strong>
//                         </div>
//                         <div>
//                             {/* <h6>ATPL</h6> */}
//                             <strong><p className="mb-0" style={{ color: 'rgb(250 200 88)' }}>
//                                 ₹{latestBalances.atpl != null
//                                     ? Math.round(latestBalances.atpl).toLocaleString('en-IN')
//                                     : "---"}
//                             </p></strong>
//                         </div>
//                         <div>
//                             {/* <h6>RS Hospitality</h6> */}
//                             <strong><p className="mb-0" style={{ color: 'rgb(238 102 102)' }}>
//                                 ₹{latestBalances.rsHospitality != null
//                                     ? Math.round(latestBalances.rsHospitality).toLocaleString('en-IN')
//                                     : "---"}
//                             </p></strong>
//                         </div>
//                         <div>
//                             {/* <h6>Net</h6> */}
//                             <strong><p className="mb-0" style={{ color: 'rgb(84 112 198)' }}>
//                                 ₹{latestBalances.netBalance != null
//                                     ? Math.round(latestBalances.netBalance).toLocaleString('en-IN')
//                                     : "---"}
//                             </p></strong>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardBankBalance


import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as echarts from 'echarts';

const DashboardBankBalance = () => {
    const doughnutRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [latestBalances, setLatestBalances] = useState({
        bankBalance: 0,
        mobisoft: 0,
        atpl: 0,
        rsHospitality: 0,
        netBalance: 0,
    });

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
                        formatted.push({ value: latest.atpl, name: 'ATPL' });
                    }
                    if (latest.rsHospitality !== null) {
                        formatted.push({ value: latest.rsHospitality, name: 'RS Hospitality' });
                    }
                    if (latest.netBalance !== null) {
                        formatted.push({ value: latest.netBalance, name: 'Net Balance' });
                    }

                    setChartData(formatted);

                    setLatestBalances({
                        bankBalance: latest.bankBalance,
                        mobisoft: latest.mobisoft,
                        atpl: latest.atpl,
                        rsHospitality: latest.rsHospitality,
                        netBalance: latest.netBalance,
                    });
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
        handleGetBankBalanceData();
    }, []);

    useEffect(() => {
        if (!chartData.length) return;

        const chartDom = doughnutRef.current;
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                // text: 'Bank Balance Distribution',
                // subtext: 'Latest Data',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    const value = Math.round(params.value).toLocaleString('en-IN');
                    return `${params.name}<br/>₹${value} (${params.percent}%)`;
                },
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: 'Bank Allocation',
                    type: 'pie',
                    radius: '50%',
                    data: chartData,
                    label: {
                        show: true,
                        formatter: params => {
                            const value = Math.round(params.value).toLocaleString('en-IN');
                            // Use rich text tags to separate styles
                            return `{name|${params.name}}\n{value|₹${value}}`;
                        },
                        rich: {
                            name: {
                                fontWeight: 'normal',
                                fontSize: 12,
                                color: '#000',
                                align: 'center',
                            },
                            value: {
                                fontWeight: 'bold',
                                fontSize: 12,
                                color: '#000',
                                align: 'center',
                            },
                        },
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            // fontWeight: 'bold',
                        },
                    },
                },
            ],
        };

        myChart.setOption(option);

        window.addEventListener('resize', myChart.resize);
        return () => {
            window.removeEventListener('resize', myChart.resize);
            myChart.dispose();
        };
    }, [chartData]);


    return (
        <div className="col-lg-6">
            <div className="card position-relative">
                <div className="card-body">
                    <h5 className="card-title">Bank Balance - INR</h5>
                    <div
                        ref={doughnutRef}
                        style={{ width: '100%', height: '325px', marginTop: '15px' }}
                    ></div>

                    <br />

                    {/* <div className="d-flex justify-content-around text-center">
                        <div>
                            <strong>
                                <p className="mb-0" style={{ color: 'rgb(84 112 198)' }}>
                                    ₹
                                    {latestBalances.bankBalance != null
                                        ? Math.round(latestBalances.bankBalance).toLocaleString('en-IN')
                                        : '---'}
                                </p>
                            </strong>
                        </div>
                        <div>
                            <strong>
                                <p className="mb-0">
                                    ₹
                                    {latestBalances.mobisoft != null
                                        ? Number(latestBalances.mobisoft).toLocaleString('en-IN')
                                        : '---'}
                                </p>
                            </strong>
                        </div>
                        <div>
                            <strong>
                                <p className="mb-0" style={{ color: 'rgb(250 200 88)' }}>
                                    ₹
                                    {latestBalances.atpl != null
                                        ? Math.round(latestBalances.atpl).toLocaleString('en-IN')
                                        : '---'}
                                </p>
                            </strong>
                        </div>
                        <div>
                            <strong>
                                <p className="mb-0" style={{ color: 'rgb(238 102 102)' }}>
                                    ₹
                                    {latestBalances.rsHospitality != null
                                        ? Math.round(latestBalances.rsHospitality).toLocaleString('en-IN')
                                        : '---'}
                                </p>
                            </strong>
                        </div>
                        <div>
                            <strong>
                                <p className="mb-0" style={{ color: 'rgb(84 112 198)' }}>
                                    ₹
                                    {latestBalances.netBalance != null
                                        ? Math.round(latestBalances.netBalance).toLocaleString('en-IN')
                                        : '---'}
                                </p>
                            </strong>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default DashboardBankBalance;
