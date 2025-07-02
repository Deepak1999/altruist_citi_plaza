// import React, { useEffect, useRef, useState } from 'react';
// import { toast } from 'react-toastify';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
// import * as echarts from 'echarts';

// const DashboardBankBalance = () => {
//     const doughnutRef = useRef(null);
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
//                         formatted.push({ value: latest.atpl, name: 'ATPL' });
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
//         handleGetBankBalanceData();
//     }, []);

//     useEffect(() => {
//         if (!chartData.length) return;

//         const chartDom = doughnutRef.current;
//         const myChart = echarts.init(chartDom);

//         const option = {
//             title: {
//                 // text: 'Bank Balance Distribution',
//                 // subtext: 'Latest Data',
//                 left: 'center',
//             },
//             tooltip: {
//                 trigger: 'item',
//                 formatter: params => {
//                     const value = Math.round(params.value).toLocaleString('en-IN');
//                     return `${params.name}<br/>₹${value} (${params.percent}%)`;
//                 },
//             },
//             legend: {
//                 orient: 'vertical',
//                 left: 'left',
//             },
//             series: [
//                 {
//                     name: 'Bank Allocation',
//                     type: 'pie',
//                     radius: '70%',
//                     data: chartData,
//                     label: {
//                         show: true,
//                         formatter: params => {
//                             const value = Math.round(params.value).toLocaleString('en-IN');
//                             return `{name|${params.name}}\n\n{value|₹${value}}`;
//                         },
//                         rich: {
//                             name: {
//                                 fontWeight: 'normal',
//                                 fontSize: 10,
//                                 color: '#000',
//                                 align: 'center',
//                             },
//                             value: {
//                                 fontWeight: 'bold',
//                                 fontSize: 13,
//                                 color: '#000',
//                                 align: 'center',
//                             },
//                         },
//                         align: 'center',
//                         verticalAlign: 'middle',
//                     },
//                     emphasis: {
//                         label: {
//                             show: true,
//                             fontSize: 18,
//                             // fontWeight: 'bold',
//                         },
//                     },
//                 },
//             ],
//         };

//         myChart.setOption(option);

//         window.addEventListener('resize', myChart.resize);
//         return () => {
//             window.removeEventListener('resize', myChart.resize);
//             myChart.dispose();
//         };
//     }, [chartData]);


//     return (
//         <div className="col-lg-6">
//             <div className="card position-relative">
//                 <div className="card-body">
//                     <h5 className="card-title">Bank Balance - INR</h5>
//                     <div
//                         ref={doughnutRef}
//                         style={{ width: '100%', height: '350px', marginTop: '15px' }}
//                     ></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardBankBalance;


import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as echarts from 'echarts';

const DashboardBankBalance = () => {
    const chartRef = useRef(null);
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
                        formatted.push({ value: latest.bankBalance, name: 'Bank Bal.' });
                    }
                    if (latest.mobisoft !== null) {
                        formatted.push({ value: latest.mobisoft, name: 'Mobisoft' });
                    }
                    if (latest.atpl !== null) {
                        formatted.push({ value: latest.atpl, name: 'ATPL' });
                    }
                    if (latest.rsHospitality !== null) {
                        formatted.push({ value: latest.rsHospitality, name: 'RS Hosp.' });
                    }
                    if (latest.netBalance !== null) {
                        formatted.push({ value: latest.netBalance, name: 'Net Bal.' });
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

        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        const names = chartData.map(item => item.name);
        const values = chartData.map(item => item.value);

        // Build base series for waterfall effect
        const base = [];
        let cumulative = 0;
        for (let i = 0; i < values.length; i++) {
            base.push(cumulative);
            cumulative += values[i];
        }

        const option = {
            title: {
                text: '',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const value = Math.round(params[1].value).toLocaleString('en-IN');
                    return `${params[1].name}<br/>₹${value}`;
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: names,
                axisTick: { alignWithLabel: true },
                axisLabel: {
                    interval: 0,
                    rotate: 20,
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: value => {
                        const absValue = Math.abs(value);
                        let formatted = '';
                        if (absValue >= 10000000) {
                            formatted = (absValue / 10000000).toFixed(2).replace(/\.?0+$/, '') + 'Cr';
                        } else if (absValue >= 100000) {
                            formatted = (absValue / 100000).toFixed(2).replace(/\.?0+$/, '') + 'L';
                        } else if (absValue >= 1000000) {
                            formatted = (absValue / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
                        } else if (absValue >= 1000) {
                            formatted = (absValue / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
                        } else {
                            formatted = absValue.toString();
                        }
                        return value < 0 ? `-${formatted}` : formatted;
                    }
                }
            },
            series: [
                {
                    name: 'Base',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent',
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent',
                        },
                    },
                    data: base,
                },
                {
                    name: 'Value',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: params => `₹${params.value.toLocaleString('en-IN')}`,
                    },
                    itemStyle: {
                        color: function (params) {
                            const colors = ['#91cc75', '#fac858', '#ee6666', '#73c0de', '#5470c6'];
                            return colors[params.dataIndex % colors.length];
                        },
                    },
                    data: values,
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
                    <h5 className="card-title">Bank Balance Summary- INR</h5>
                    <div
                        ref={chartRef}
                        style={{ width: '100%', height: '350px', marginTop: '15px' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardBankBalance;
