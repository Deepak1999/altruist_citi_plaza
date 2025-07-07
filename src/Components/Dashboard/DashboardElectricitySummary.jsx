import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardElectricitySummary = () => {
    const electricityChartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [electricityFilter, setElectricityFilter] = useState('6 Months');
    const [filterType, setFilterType] = useState('6 Months');
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

    // const fetchElectricityData = async (period) => {
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) return;

    //     try {
    //         const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=${period}`, {
    //             headers: { userId },
    //         });

    //         const result = await response.json();
    //         const details = result.dashboardElectricitySummaryDetails || {};
    //         const months = Object.keys(details).sort();

    //         setTotalElectricitySummaryData(result.totalData.total || {});

    //         const totalBilledAmount = [];
    //         const totalPaidAmount = [];
    //         const postPaidAmount = [];
    //         const prePaidAmount = [];

    //         months.forEach((month) => {
    //             const d = details[month];
    //             totalBilledAmount.push(+d.totalBilledAmount);
    //             totalPaidAmount.push(+d.totalPaidAmount);
    //             postPaidAmount.push(+d.postPaidAmount);
    //             prePaidAmount.push(+d.prePaidAmount);
    //         });

    //         const chart = chartInstanceRef.current;
    //         chart.setOption({
    //             tooltip: {
    //                 trigger: 'axis',
    //                 formatter: function (params) {
    //                     let tooltipText = '';
    //                     params.forEach(function (item) {
    //                         tooltipText += `${item.marker} ${item.seriesName}: ₹${item.value.toLocaleString('en-IN')}<br/>`;
    //                     });
    //                     return tooltipText;
    //                 }
    //             },
    //             legend: {
    //                 data: [
    //                     'Postpaid Billing',
    //                     // 'Paid Amount',
    //                     'Postpaid Collection',
    //                     'Prepaid Collection',
    //                 ],
    //                 top: 25,
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 data: months,
    //             },
    //             yAxis: {
    //                 type: 'value',
    //                 axisLabel: {
    //                     formatter: function (value) {
    //                         if (value >= 1_00_00_000) return (value / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    //                         if (value >= 1_00_000) return (value / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
    //                         if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    //                         return value;
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     name: 'Postpaid Billing',
    //                     type: 'bar',
    //                     data: totalBilledAmount,
    //                     itemStyle: { color: '#de0b8b' },
    //                 },
    //                 // {
    //                 //     name: 'Paid Amount',
    //                 //     type: 'bar',
    //                 //     data: totalPaidAmount,
    //                 //     itemStyle: { color: '#4caf50' },
    //                 // },
    //                 {
    //                     name: 'Postpaid Collection',
    //                     type: 'bar',
    //                     data: postPaidAmount,
    //                     itemStyle: { color: '#0baade' },
    //                 },
    //                 {
    //                     name: 'Prepaid Collection',
    //                     type: 'bar',
    //                     data: prePaidAmount,
    //                     itemStyle: { color: '#ff9800' },
    //                 },
    //             ],
    //         });
    //     } catch (error) {
    //         console.error('Error fetching electricity data:', error);
    //     }
    // };

    const fetchElectricityData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/electricity-summary?period=${period}`, {
                headers: { userId },
            });

            const result = await response.json();
            const details = result.dashboardElectricitySummaryDetails || {};
            const months = Object.keys(details).sort();

            setTotalElectricitySummaryData(result.totalData.total || {});

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
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        if (!params.length) return '';

                        const rawDate = params[0].axisValue;
                        const formattedDate = customFormatDate(rawDate);

                        let tooltipText = `<strong>${formattedDate}</strong><br/>`;
                        params.forEach(function (item) {
                            tooltipText += `${item.marker} ${item.seriesName}: ₹${item.value.toLocaleString('en-IN')}<br/>`;
                        });
                        return tooltipText;
                    }
                },
                legend: {
                    data: [
                        'Postpaid Billing',
                        // 'Paid Amount',
                        'Postpaid Collection',
                        'Prepaid Collection',
                    ],
                    top: 25,
                },
                xAxis: {
                    type: 'category',
                    data: months,
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value) {
                            if (value >= 1_00_00_000) return (value / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
                            if (value >= 1_00_000) return (value / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
                            if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                            return value;
                        }
                    }
                },
                series: [
                    {
                        name: 'Postpaid Billing',
                        type: 'bar',
                        data: totalBilledAmount,
                        itemStyle: { color: '#de0b8b' },
                    },
                    // {
                    //     name: 'Paid Amount',
                    //     type: 'bar',
                    //     data: totalPaidAmount,
                    //     itemStyle: { color: '#4caf50' },
                    // },
                    {
                        name: 'Postpaid Collection',
                        type: 'bar',
                        data: postPaidAmount,
                        itemStyle: { color: '#0baade' },
                    },
                    {
                        name: 'Prepaid Collection',
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

    function customFormatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (day === 1) {
            return `${monthNames[monthIndex]}`;
        }

        const suffix = getDaySuffix(day);
        return `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
    }

    function getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

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
            const { statusCode } = json.statusDescription;

            if (statusCode !== 200) {
                toast.error('Failed to fetch consolidated summary.');
                return;
            }

            if (Object.keys(data).length === 0) {
                setModalTitle(`${seriesName} • ${yearMonth}`);
                setModalColumns([]);
                setModalRows([]);
                setModalVisible(true);
                return;
            }

            const firstItem = data[Object.keys(data)[0]];
            // const columns = Object.keys(firstItem).map((key) => ({
            //     key,
            //     label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
            // }));
            const columns = Object.keys(firstItem).map((key) => {
                const formattedLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

                let label = formattedLabel;

                if (formattedLabel === 'Postpaid Amount') {
                    label = 'Postpaid Collection';
                } else if (formattedLabel === 'Total Paid Amount') {
                    label = 'Prepaid Collection';
                }

                return {
                    key,
                    label,
                };
            });

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
        setFilterType(rangeLabel);
        const map = { 'YoY': -1, 'MoM': -3, 'Current Month': '0', 'Prev Month': -2, '3 Months': 3, '6 Months': 6, '9 Months': 9, '12 Months': 12 };
        if (map[rangeLabel]) fetchElectricityData(map[rangeLabel]);
    };

    useEffect(() => {
        const chart = echarts.init(electricityChartRef.current);
        chartInstanceRef.current = chart;

        chart.on('click', (params) => {
            const month = params.name;
            const series = params.seriesName;

            let category;
            if (series === 'Postpaid Billing') category = 1;
            // else if (series === 'Paid Amount') category = 2;
            else if (series === 'Postpaid Collection') category = 3;
            else if (series === 'Prepaid Collection') category = 4;
            else return;

            fetchDetails(category, month, series);
        });

        fetchElectricityData(6);
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

    // useEffect(() => {
    //     handleGetTotalElectricitySummary();
    // }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Electricity Summary</h5>
                        <strong>
                            <span style={{ marginLeft: '140px' }}>
                                {filterType && `${filterType}`}
                            </span>
                        </strong>
                        <div style={{ position: 'relative' }}>
                            <i
                                className="fa-solid fa-filter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)}
                            ></i>
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                                    {['YoY', 'MoM', 'Current Month', 'Prev Month', '3 Months', '6 Months', '9 Months', '12 Months'].map((range) => (
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
                            <h6>Billing</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.totalBilledAmount || 0).toLocaleString('en-IN')}
                            </p></strong>
                        </div>
                        <div>
                            <h6>Postpaid Collection</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.postPaidAmount || 0).toLocaleString('en-IN')}
                            </p></strong>
                        </div>
                        <div>
                            <h6>Prepaid Collection</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalElectricitySummaryData.prePaidAmount || 0).toLocaleString('en-IN')}
                            </p></strong>
                        </div>
                        {/* <div>
                            <h6>Total Collection</h6>
                            <p className="mb-0">
                                {parseFloat(totalElectricitySummaryData.totalPaidAmount || 0).toLocaleString('en-IN')}
                            </p>
                        </div> */}
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