// import React, { useEffect, useRef, useState } from 'react';
// import * as echarts from 'echarts';
// import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

// const DashboardElectricitySummary = () => {

//     const electricityChartRef = useRef(null);
//     const chartInstanceRef = useRef(null);
//     const [showRentDropdown, setShowRentDropdown] = useState(false);
//     const [electricityFilter, setElectricityFilter] = useState('3Month');

//     const fetchElectricityData = async (period) => {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//             console.warn("userId not found in localStorage");
//             return;
//         }

//         try {
//             const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=${period}`,
//                 {
//                     headers: {
//                         'userId': userId,
//                     },
//                 }
//             );

//             if (!response.ok) throw new Error('Failed to fetch electricity summary');

//             const result = await response.json();
//             const electricityDetails = result.dashboardElectricitySummaryDetails || {};

//             const months = Object.keys(electricityDetails).sort();

//             const totalBilledAmount = [];
//             const totalPaidAmount = [];
//             const postPaidAmount = [];
//             const prePaidAmount = [];

//             months.forEach((month) => {
//                 const data = electricityDetails[month];
//                 totalBilledAmount.push(parseFloat(data.totalBilledAmount));
//                 totalPaidAmount.push(parseFloat(data.totalPaidAmount));
//                 postPaidAmount.push(parseFloat(data.postPaidAmount));
//                 prePaidAmount.push(parseFloat(data.prePaidAmount));
//             });

//             const option = {
//                 title: { text: 'Electricity Summary', left: 'center' },
//                 tooltip: { trigger: 'axis' },
//                 legend: {
//                     data: ['Billed Amount', 'Paid Amount', 'Postpaid Amount', 'Prepaid Amount'],
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
//                         name: 'Billed Amount',
//                         type: 'bar',
//                         data: totalBilledAmount,
//                         itemStyle: { color: '#de0b8b' },
//                     },
//                     {
//                         name: 'Paid Amount',
//                         type: 'bar',
//                         data: totalPaidAmount,
//                         itemStyle: { color: '#4caf50' },
//                     },
//                     {
//                         name: 'Postpaid Amount',
//                         type: 'bar',
//                         data: postPaidAmount,
//                         itemStyle: { color: '#0baade' },
//                     },
//                     {
//                         name: 'Prepaid Amount',
//                         type: 'bar',
//                         data: prePaidAmount,
//                         itemStyle: { color: '#ff9800' },
//                     },
//                 ],
//             };

//             chartInstanceRef.current.setOption(option);
//         } catch (error) {
//             console.error('Error fetching electricity data:', error);
//         }
//     };

//     const updateElectricityChart = (rangeLabel) => {
//         setElectricityFilter(rangeLabel);
//         setShowRentDropdown(false);

//         const periodMap = {
//             '3Month': 3,
//             '6Month': 6,
//             '9Month': 9,
//             '12Month': 12,
//         };

//         const period = periodMap[rangeLabel];
//         if (period) {
//             fetchElectricityData(period);
//         }
//     };

//     useEffect(() => {
//         const chart = echarts.init(electricityChartRef.current);
//         chartInstanceRef.current = chart;

//         window.addEventListener('resize', chart.resize);

//         fetchElectricityData(3);

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
//                         <h5 className="card-title">Electricity Summary</h5>
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
//                                             onClick={() => updateElectricityChart(range)}
//                                         >
//                                             {range}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div
//                         ref={electricityChartRef}
//                         style={{ width: '100%', height: '300px', marginTop: '15px' }}
//                     ></div>

//                     <div className="d-flex justify-content-around text-center">
//                         <div>
//                             <h6>Total Billed Amt.</h6>
//                             <p className="mb-0">$10,000</p>
//                         </div>
//                         <div>
//                             <h6>Total Paid Amt.</h6>
//                             <p className="mb-0">$7,500</p>
//                         </div>
//                         <div>
//                             <h6>Total Postpaid Amt.</h6>
//                             <p className="mb-0">$2,500</p>
//                         </div>
//                         <div>
//                             <h6>Total Prepaid Amt.</h6>
//                             <p className="mb-0">$2,500</p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardElectricitySummary;




import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardElectricitySummary = () => {
    const electricityChartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [electricityFilter, setElectricityFilter] = useState('3Month');

    const [totalElectricitySummaryData, setTotalElectricitySummaryData] = useState({
        totalBilledAmount: 0,
        totalPaidAmount: 0,
        postPaidAmount: 0,
        prePaidAmount: 0,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    const fetchElectricityData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=${period}`,
                {
                    headers: { userId },
                }
            );

            const result = await response.json();
            const details = result.dashboardElectricitySummaryDetails || {};
            const months = Object.keys(details).sort();

            const totalBilledAmount = [];
            const totalPaidAmount = [];
            const postPaidAmount = [];
            const prePaidAmount = [];

            months.forEach((month) => {
                const d = details[month];
                totalBilledAmount.push(+d.totalBilledAmount);
                totalPaidAmount.push(+d.totalPaidAmount);
                postPaidAmount.push(+d.postPaidAmount);
                prePaidAmount.push(+d.prePaidAmount);
            });

            const chart = chartInstanceRef.current;
            chart.setOption({
                title: { text: 'Electricity Summary', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: [
                        'Billed Amount',
                        'Paid Amount',
                        'Postpaid Amount',
                        'Prepaid Amount',
                    ],
                    top: 25,
                },
                xAxis: { type: 'category', data: months },
                yAxis: { type: 'value' },
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
            });
        } catch (error) {
            console.error('Error fetching electricity data:', error);
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
                    group: 2,
                    category,
                    yearMonth,
                }),
            });

            const json = await response.json();
            const data = json.data || {};

            if (Object.keys(data).length === 0) {
                setModalTitle(`${seriesName} • ${yearMonth}`);
                setModalColumns([]);
                setModalRows([]);
                setModalVisible(true);
                return;
            }

            const firstItem = data[Object.keys(data)[0]];
            const columns = Object.keys(firstItem).map((key) => ({
                key,
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
            }));


            const rows = Object.entries(data).map(([id, item]) => ({
                id,
                ...item,
            }));

            setModalTitle(`${seriesName} • ${yearMonth}`);
            setModalColumns(columns);
            setModalRows(rows);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching detail data:', error);
        }
    };

    const updateElectricityChart = (rangeLabel) => {
        setElectricityFilter(rangeLabel);
        setShowDropdown(false);
        const map = { '3Month': 3, '6Month': 6, '9Month': 9, '12Month': 12 };
        if (map[rangeLabel]) fetchElectricityData(map[rangeLabel]);
    };

    useEffect(() => {
        const chart = echarts.init(electricityChartRef.current);
        chartInstanceRef.current = chart;

        chart.on('click', (params) => {
            const month = params.name;
            const series = params.seriesName;

            let category;
            if (series === 'Billed Amount') category = 1;
            else if (series === 'Paid Amount') category = 2;
            else if (series === 'Postpaid Amount') category = 3;
            else if (series === 'Prepaid Amount') category = 4;
            else return;

            fetchDetails(category, month, series);
        });

        fetchElectricityData(3);
        window.addEventListener('resize', chart.resize);
        return () => {
            chart.dispose();
            window.removeEventListener('resize', chart.resize);
        };
    }, []);

    const handleGetTotalElectricitySummary = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=-1`, {
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
                    const summary = data.dashboardElectricitySummaryDetails?.total;

                    if (summary) {
                        setTotalElectricitySummaryData(summary);
                    } else {
                        toast.success(description || 'Electricity summary data is missing.');
                    }
                } else {
                    toast.error(description || 'Failed to fetch Electricity summary.');
                }
            } else {
                toast.error('Request failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetTotalElectricitySummary();
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
                                onClick={() => setShowDropdown(!showDropdown)}
                            ></i>
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
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
                    />

                    <div className="d-flex justify-content-around text-center mt-3">
                        <div>
                            <h6>Billed</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.totalBilledAmount || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Paid</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.totalPaidAmount || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Postpaid</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.postPaidAmount || 0).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h6>Prepaid</h6>
                            <p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.prePaidAmount || 0).toFixed(2)}
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
                                                        <td key={col.key}>{row[col.key] || ''}</td>
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

export default DashboardElectricitySummary;
