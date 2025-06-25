// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Chart,
//     BarController,
//     BarElement,
//     CategoryScale,
//     LinearScale,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
// import { toast } from 'react-toastify';

// Chart.register(
//     BarController,
//     BarElement,
//     CategoryScale,
//     LinearScale,
//     Title,
//     Tooltip,
//     Legend
// );

// const DashboardSolar = () => {
//     const chartRef = useRef(null);
//     const chartInstance = useRef(null);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [selectedPeriod, setSelectedPeriod] = useState('3Month');

//     const [totalSolarSummaryData, setTotalSolarSummaryData] = useState({
//         plant1Produce: 0,
//         plant2Produce: 0,
//     });

//     const periodMap = {
//         '3Month': 3,
//         '6Month': 6,
//         '9Month': 9,
//         '12Month': 12,
//     };

//     const fetchSolarData = async (period) => {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//             console.warn('userId not found in localStorage');
//             return;
//         }

//         try {
//             const response = await fetch(
//                 `${ApiBaseUrl}/dashboard/solar-logs-summary?period=${period}`,
//                 {
//                     headers: {
//                         userId: userId,
//                     },
//                 }
//             );

//             const result = await response.json();
//             const rawData = result.data || {};

//             const months = Object.keys(rawData).sort();
//             const plant1Data = [];
//             const plant2Data = [];

//             months.forEach((month) => {
//                 const data = rawData[month];
//                 plant1Data.push(data.plant1Produce || 0);
//                 plant2Data.push(data.plant2Produce || 0);
//             });

//             updateChart(months, plant1Data, plant2Data);
//         } catch (error) {
//             console.error('Error fetching solar data:', error);
//         }
//     };

//     const updateChart = (labels, plant1, plant2) => {
//         const ctx = chartRef.current.getContext('2d');
//         if (chartInstance.current) {
//             chartInstance.current.destroy();
//         }

//         chartInstance.current = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels,
//                 datasets: [
//                     {
//                         label: 'Plant 1',
//                         data: plant1,
//                         backgroundColor: '#4caf50',
//                         borderColor: '#4caf50',
//                         borderWidth: 1,
//                     },
//                     {
//                         label: 'Plant 2',
//                         data: plant2,
//                         backgroundColor: '#2196f3',
//                         borderColor: '#2196f3',
//                         borderWidth: 1,
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: { position: 'top' },
//                     title: {
//                         display: true,
//                         text: 'Solar Energy Summary - Plant 1 & Plant 2',
//                     },
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                     },
//                 },
//             },
//         });
//     };

//     const handlePeriodChange = (label) => {
//         setSelectedPeriod(label);
//         setShowDropdown(false);
//         const period = periodMap[label];
//         if (period) {
//             fetchSolarData(period);
//         }
//     };

//     useEffect(() => {
//         fetchSolarData(periodMap[selectedPeriod]);

//         return () => {
//             if (chartInstance.current) {
//                 chartInstance.current.destroy();
//             }
//         };
//     }, []);

//     const handleGetTotalSolarSummary = async () => {
//         const userId = localStorage.getItem('userId');

//         if (!userId) {
//             toast.error('Missing necessary data in localStorage');
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/dashboard/solar-logs-summary?period=-1`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     userId: userId,
//                 },
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const { statusCode, description } = data.statusDescription;

//                 if (statusCode === 200) {
//                     const summary = data.data;

//                     if (summary) {
//                         setTotalSolarSummaryData(summary);
//                     } else {
//                         toast.success(description || 'Solar summary data is missing.');
//                     }
//                 } else {
//                     toast.error(description || 'Failed to fetch Solar summary.');
//                 }
//             } else {
//                 toast.error('Request failed with status: ' + response.status);
//             }
//         } catch (error) {
//             toast.error('Error fetching data: ' + error.message);
//         }
//     };

//     useEffect(() => {
//         handleGetTotalSolarSummary();
//     }, []);

//     return (
//         <div className="col-lg-6">
//             <div className="card">
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <h5 className="card-title">Solar Plant Summary</h5>
//                         <div style={{ position: 'relative' }}>
//                             <i
//                                 className="fa-solid fa-filter"
//                                 style={{ cursor: 'pointer' }}
//                                 onClick={() => setShowDropdown(!showDropdown)}
//                             ></i>
//                             {showDropdown && (
//                                 <div
//                                     className="dropdown-menu show"
//                                     style={{
//                                         position: 'absolute',
//                                         top: '100%',
//                                         right: 0,
//                                         zIndex: 1000,
//                                     }}
//                                 >
//                                     {Object.keys(periodMap).map((range) => (
//                                         <button
//                                             key={range}
//                                             className="dropdown-item"
//                                             onClick={() => handlePeriodChange(range)}
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
//                     ></canvas><br />

//                     <div className="d-flex justify-content-around text-center">
//                         <div>
//                             <h6>Plant-1</h6>
//                             <p className="mb-0">
//                                 {parseFloat(totalSolarSummaryData.plant1Produce || 0).toFixed(2)}
//                             </p>
//                         </div>
//                         <div>
//                             <h6>Plant-2</h6>
//                             <p className="mb-0">
//                                 {parseFloat(totalSolarSummaryData.plant2Produce || 0).toFixed(2)}
//                             </p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardSolar;


import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardSolar = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('3Month');

    const [totalSolarSummaryData, setTotalSolarSummaryData] = useState({
        plant1Produce: 0,
        plant2Produce: 0
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    const fetchSolarData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/solar-logs-summary?period=${period}`, {
                headers: { userId }
            });

            const result = await response.json();
            const rawData = result.data || {};

            const months = Object.keys(rawData).sort();
            const plant1Data = [], plant2Data = [];

            months.forEach(month => {
                const data = rawData[month];
                plant1Data.push(data.plant1Produce || 0);
                plant2Data.push(data.plant2Produce || 0);
            });

            const chart = chartInstanceRef.current;
            chart.setOption({
                title: { text: 'Solar Energy Summary', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: { data: ['Plant 1', 'Plant 2'], top: 25 },
                xAxis: { type: 'category', data: months },
                yAxis: { type: 'value' },
                series: [
                    { name: 'Plant 1', type: 'bar', data: plant1Data, itemStyle: { color: '#4caf50' } },
                    { name: 'Plant 2', type: 'bar', data: plant2Data, itemStyle: { color: '#2196f3' } }
                ]
            });
        } catch (error) {
            console.error('Error fetching solar data:', error);
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
                    userId
                },
                body: JSON.stringify({
                    group: 5,
                    category,
                    yearMonth
                })
            });

            const result = await response.json();
            const { statusCode } = result.statusDescription;

            if (statusCode !== 200) {
                toast.error('Failed to fetch consolidated summary.');
                return;
            }

            const data = result.data || {};
            const rows = Object.entries(data).map(([timestamp, value]) => ({
                timestamp,
                value
            }));

            setModalTitle(`${label} • ${yearMonth}`);
            setModalColumns([
                { key: 'timestamp', label: 'Timestamp' },
                { key: 'value', label: 'Value' }
            ]);
            setModalRows(rows);
            setModalVisible(true);
        } catch (error) {
            toast.error('Error fetching details: ' + error.message);
        }
    };

    const updateChart = (range) => {
        setSelectedPeriod(range);
        setShowDropdown(false);
        const map = { '3Month': 3, '6Month': 6, '9Month': 9, '12Month': 12 };
        if (map[range]) fetchSolarData(map[range]);
    };

    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        chartInstanceRef.current = chart;

        chart.on('click', (params) => {
            const month = params.name;
            const seriesName = params.seriesName;
            const category = seriesName === 'Plant 1' ? '1' : '2';
            fetchDetails(category, month, seriesName);
        });

        window.addEventListener('resize', chart.resize);
        fetchSolarData(3);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', chart.resize);
        };
    }, []);

    const handleGetTotalSolarSummary = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('UserId not found in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/solar-logs-summary?period=-1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId
                }
            });

            const result = await response.json();
            const { statusCode } = result.statusDescription;

            if (statusCode === 200) {
                const summary = result.data;
                setTotalSolarSummaryData(summary || {});
            } else {
                toast.error('Failed to fetch total solar summary.');
            }
        } catch (error) {
            toast.error('Error fetching total summary: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetTotalSolarSummary();
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Solar Plant Summary</h5>
                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-filter" style={{ cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)} />
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                                    {['3Month', '6Month', '9Month', '12Month'].map(label => (
                                        <button key={label} className="dropdown-item" onClick={() => updateChart(label)}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div ref={chartRef} style={{ width: '100%', height: '275px', marginTop: '15px' }} />

                    <div className="d-flex justify-content-around text-center">
                        <div>
                            <h6>Plant-1</h6>
                            <p className="mb-0">
                                {parseFloat(totalSolarSummaryData.plant1Produce || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Plant-2</h6>
                            <p className="mb-0">
                                {parseFloat(totalSolarSummaryData.plant2Produce || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {modalVisible && (
                <div className="modal show d-block" tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {modalRows.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {modalColumns.map(col => (
                                                    <th key={col.key}>{col.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalRows.map((row, i) => (
                                                <tr key={i}>
                                                    {modalColumns.map(col => (
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

export default DashboardSolar;
