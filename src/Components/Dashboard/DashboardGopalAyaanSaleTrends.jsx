// import React, { useEffect, useRef, useState } from 'react';
// import * as echarts from 'echarts';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

// const DashboardGopalAyaanSaleTrends = () => {
//     const [showRentDropdown, setShowRentDropdown] = useState(false);
//     const [gopalAyaanCinemaFilter, setGopalAyaanCimenaFilter] = useState('3Month');
//     const lineChartRef = useRef(null);
//     const chartInstanceRef = useRef(null);

//     const fetchGopalAyaanCinemaData = async (period) => {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//             console.warn("userId not found in localStorage");
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/dashboard/sale-log-summary?period=${period}`,
//                 {
//                     headers: {
//                         'userId': userId,
//                     },
//                 }
//             );

//             if (!response.ok) throw new Error('Failed to fetch Gopal & Ayaan summary');

//             const result = await response.json();
//             const gopalAyaanDetails = result.dashboardSalesLogDetails || {};

//             const months = Object.keys(gopalAyaanDetails).sort();

//             const gopalAmount = [];
//             const ayaanAmount = [];
//             const gopalAtplShare = [];
//             const ayaanAtplShare = [];

//             months.forEach((month) => {
//                 const data = gopalAyaanDetails[month];
//                 gopalAmount.push(parseFloat(data.gopalAmount));
//                 ayaanAmount.push(parseFloat(data.ayaanAmount));
//                 gopalAtplShare.push(parseFloat(data.gopalAtplShare));
//                 ayaanAtplShare.push(parseFloat(data.ayaanAtplShare));
//             });

//             const option = {
//                 title: { text: 'Sales Trend & Share', left: 'center' },
//                 tooltip: { trigger: 'axis' },
//                 legend: {
//                     data: ['Gopal Sale', 'Ayaan Sale', 'Gopal Atpl Share', 'Ayaan Atpl Share'],
//                     top: 25,
//                 },
//                 xAxis: {
//                     type: 'category',
//                     data: months,
//                 },
//                 yAxis: {
//                     type: 'value',
//                 },
//                 series: [
//                     {
//                         name: 'Gopal Sale',
//                         type: 'line',
//                         smooth: true,
//                         data: gopalAmount,
//                         lineStyle: {
//                             color: '#9c64f3',
//                         },
//                         itemStyle: { color: '#9c64f3' },
//                     },
//                     {
//                         name: 'Ayaan Sale',
//                         type: 'line',
//                         smooth: true,
//                         data: ayaanAmount,
//                         lineStyle: {
//                             color: '#4caf50',
//                         },
//                         itemStyle: { color: '#4caf50' },

//                     },
//                     {
//                         name: 'Gopal Atpl Share',
//                         type: 'line',
//                         smooth: true,
//                         data: gopalAtplShare,
//                         lineStyle: {
//                             color: '#4caf50',
//                         },
//                         itemStyle: { color: '#4caf50' },

//                     },
//                     {
//                         name: 'Ayaan Atpl Share',
//                         type: 'line',
//                         smooth: true,
//                         data: ayaanAtplShare,
//                         lineStyle: {
//                             color: '#4caf50',
//                         },
//                         itemStyle: { color: '#4caf50' },

//                     },
//                 ],
//             };

//             chartInstanceRef.current.setOption(option);
//         } catch (error) {
//             console.error('Error fetching Gopal & Ayaan data:', error);
//         }
//     };

//     const updateGopalAyaanChart = (rangeLabel) => {
//         setGopalAyaanCimenaFilter(rangeLabel);
//         setShowRentDropdown(false);

//         const periodMap = {
//             '3Month': 3,
//             '6Month': 6,
//             '9Month': 9,
//             '12Month': 12,
//         };

//         const period = periodMap[rangeLabel];
//         if (period) {
//             fetchGopalAyaanCinemaData(period);
//         }
//     };

//     useEffect(() => {
//         const chart = echarts.init(lineChartRef.current);
//         chartInstanceRef.current = chart;

//         window.addEventListener('resize', chart.resize);

//         fetchGopalAyaanCinemaData(3);

//         return () => {
//             chart.dispose();
//             window.removeEventListener('resize', chart.resize);
//         };
//     }, []);

//     return (
//         <div className="col-lg-6">
//             <div className="card">
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <h5 className="card-title">Gopal & Ayaan Cinema Sale Summary</h5>
//                         <div style={{ position: 'relative' }}>
//                             <i
//                                 className="fa-solid fa-filter"
//                                 style={{ cursor: 'pointer' }}
//                                 onClick={() => setShowRentDropdown(!showRentDropdown)}
//                             ></i>
//                             {showRentDropdown && (
//                                 <div
//                                     className="dropdown-menu show"
//                                     style={{
//                                         position: 'absolute',
//                                         top: '100%',
//                                         right: 0,
//                                         zIndex: 1000,
//                                     }}
//                                 >
//                                     {['3Month', '6Month', '9Month', '12Month'].map((range) => (
//                                         <button
//                                             key={range}
//                                             className="dropdown-item"
//                                             onClick={() => updateGopalAyaanChart(range)}
//                                         >
//                                             {range}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div
//                         ref={lineChartRef}
//                         style={{ width: '100%', height: '300px', marginTop: '15px' }}
//                     ></div>

//                     <div className="d-flex justify-content-around text-center">
//                         <div>
//                             <h6>Total Gopal</h6>
//                             <p className="mb-0">$10,000</p>
//                         </div>
//                         <div>
//                             <h6>Total Ayaan</h6>
//                             <p className="mb-0">$7,500</p>
//                         </div>
//                         <div>
//                             <h6>Total Gopal Atpl Sahre</h6>
//                             <p className="mb-0">$2,500</p>
//                         </div>
//                         <div>
//                             <h6>Total Ayaan Atpl Sahre</h6>
//                             <p className="mb-0">$2,500</p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardGopalAyaanSaleTrends;


import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardGopalAyaanSaleTrends = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [gopalAyaanCinemaFilter, setGopalAyaanCinemaFilter] = useState('3Month');
    const lineChartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const [totalGopalAyaanSummaryData, setTotalGopalAyaanSummaryData] = useState({
        gopalAmount: 0,
        ayaanAmount: 0,
        gopalAtplShare: 0,
        ayaanAtplShare: 0,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    const fetchGopalAyaanCinemaData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/sale-log-summary?period=${period}`, {
                headers: { userId },
            });

            const result = await response.json();
            const gopalAyaanDetails = result.dashboardSalesLogDetails || {};
            const months = Object.keys(gopalAyaanDetails).sort();

            const gopalAmount = [], ayaanAmount = [], gopalAtplShare = [], ayaanAtplShare = [];

            months.forEach((month) => {
                const d = gopalAyaanDetails[month];
                gopalAmount.push(+d.gopalAmount);
                ayaanAmount.push(+d.ayaanAmount);
                gopalAtplShare.push(+d.gopalAtplShare);
                ayaanAtplShare.push(+d.ayaanAtplShare);
            });

            const chart = chartInstanceRef.current;
            chart.setOption({
                title: { text: 'Sales Trend & Share', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['Gopal Sale', 'Ayaan Sale', 'Gopal Atpl Share', 'Ayaan Atpl Share'],
                    top: 25,
                },
                xAxis: { type: 'category', data: months },
                yAxis: { type: 'value' },
                series: [
                    {
                        name: 'Gopal Sale',
                        type: 'line',
                        data: gopalAmount,
                        itemStyle: { color: '#9c64f3' },
                    },
                    {
                        name: 'Ayaan Sale',
                        type: 'line',
                        data: ayaanAmount,
                        itemStyle: { color: '#4caf50' },
                    },
                    {
                        name: 'Gopal Atpl Share',
                        type: 'line',
                        data: gopalAtplShare,
                        itemStyle: { color: '#f44336' },
                    },
                    {
                        name: 'Ayaan Atpl Share',
                        type: 'line',
                        data: ayaanAtplShare,
                        itemStyle: { color: '#ff9800' },
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching Gopal & Ayaan data:', error);
        }
    };

    const fetchDetails = async (category, yearMonth, seriesName) => {
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
                    group: 3,
                    category,
                    yearMonth,
                }),
            });

            const json = await response.json();
            const data = json.data || {};

            // Case: Gopal or Ayaan Atpl Share (simple key:value map)
            if (category === 3 || category === 4) {
                const rows = Object.entries(data).map(([timestamp, amount]) => ({
                    timestamp,
                    amount,
                }));

                setModalTitle(`${seriesName} • ${yearMonth}`);
                setModalColumns([
                    { key: 'timestamp', label: 'Timestamp' },
                    { key: 'amount', label: 'Amount' },
                ]);
                setModalRows(rows);
                setModalVisible(true);
                return;
            }

            // Case: Gopal Sale or Ayaan Sale (structured object)
            const isAyaan = seriesName.includes('Ayaan');
            const columns = isAyaan
                ? [
                    { key: 'reportDate', label: 'Report Date' },
                    { key: 'totalDsrShare', label: 'Total DSR Share' },
                ]
                : [
                    { key: 'saleDate', label: 'Sale Date' },
                    { key: 'cashierName', label: 'Cashier Name' },
                    { key: 'subTotal', label: 'Sub Total' },
                ];

            const rows = Object.entries(data).map(([id, item]) => ({
                id,
                ...columns.reduce((acc, col) => {
                    acc[col.key] = item[col.key] ?? '';
                    return acc;
                }, {}),
            }));

            setModalTitle(`${seriesName} • ${yearMonth}`);
            setModalColumns(columns);
            setModalRows(rows);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching detail data:', error);
        }
    };

    const updateGopalAyaanChart = (rangeLabel) => {
        setGopalAyaanCinemaFilter(rangeLabel);
        setShowDropdown(false);
        const map = { '3Month': 3, '6Month': 6, '9Month': 9, '12Month': 12 };
        if (map[rangeLabel]) fetchGopalAyaanCinemaData(map[rangeLabel]);
    };

    useEffect(() => {
        const chart = echarts.init(lineChartRef.current);
        chartInstanceRef.current = chart;

        chart.on('click', (params) => {
            const series = params.seriesName;
            const month = params.name;

            let category;
            if (series === 'Gopal Sale') category = 1;
            else if (series === 'Ayaan Sale') category = 2;
            else if (series === 'Gopal Atpl Share') category = 3;
            else if (series === 'Ayaan Atpl Share') category = 4;
            else return;

            fetchDetails(category, month, series);
        });

        fetchGopalAyaanCinemaData(3);
        window.addEventListener('resize', chart.resize);
        return () => {
            chart.dispose();
            window.removeEventListener('resize', chart.resize);
        };
    }, []);

    const handleGetTotalGopalAyaanSummary = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/sale-log-summary?period=-1`, {
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
                    const summary = data.dashboardSalesLogDetails?.total;

                    if (summary) {
                        setTotalGopalAyaanSummaryData(summary);
                    } else {
                        toast.success(description || 'Gopal & ayaan summary data is missing.');
                    }
                } else {
                    toast.error(description || 'Failed to fetch Gopal & ayaan summary.');
                }
            } else {
                toast.error('Request failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetTotalGopalAyaanSummary();
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
                                onClick={() => setShowDropdown(!showDropdown)}
                            ></i>
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
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

                    <div className="d-flex justify-content-around text-center mt-3">
                        <div>
                            <h6>Gopal</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalGopalAyaanSummaryData.gopalAmount || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Ayaan</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalGopalAyaanSummaryData.ayaanAmount || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Gopal Share</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalGopalAyaanSummaryData.gopalAtplShare || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Ayaan Share</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalGopalAyaanSummaryData.ayaanAtplShare || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                                                        <td key={col.key}>{row[col.key] ?? ''}</td>
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

export default DashboardGopalAyaanSaleTrends;