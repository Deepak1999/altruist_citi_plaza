import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardSolar = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('Current Month');
    const [filterType, setFilterType] = useState('Current Month');
    const [totalSolarSummaryData, setTotalSolarSummaryData] = useState({
        plant1Produce: 0,
        plant2Produce: 0
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    // const fetchSolarData = async (period) => {
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) return;

    //     try {
    //         const response = await fetch(`${ApiBaseUrl}/dashboard/solar-logs-summary?period=${period}`, {
    //             headers: { userId }
    //         });

    //         const result = await response.json();
    //         const rawData = result.data || {};

    //         const months = Object.keys(rawData).sort();
    //         const plant1Data = [], plant2Data = [];

    //         setTotalSolarSummaryData(result.totalData || []);

    //         months.forEach(month => {
    //             const data = rawData[month];
    //             plant1Data.push(data.plant1Produce || 0);
    //             plant2Data.push(data.plant2Produce || 0);
    //         });

    //         const chart = chartInstanceRef.current;
    //         chart.setOption({
    //             tooltip: {
    //                 trigger: 'axis',
    //                 formatter: function (params) {
    //                     return params.map(item => {
    //                         return `${item.marker} ${item.seriesName}: ₹${item.data.toLocaleString('en-IN')}`;
    //                     }).join('<br/>');
    //                 }
    //             },
    //             legend: { data: ['Plant 1', 'Plant 2'], top: 25 },
    //             xAxis: { type: 'category', data: months },
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
    //                 { name: 'Plant 1', type: 'line', data: plant1Data, itemStyle: { color: '#4caf50' } },
    //                 { name: 'Plant 2', type: 'line', data: plant2Data, itemStyle: { color: '#2196f3' } }
    //             ]
    //         });
    //     } catch (error) {
    //         console.error('Error fetching solar data:', error);
    //     }
    // };

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

            setTotalSolarSummaryData(result.totalData || []);

            months.forEach(month => {
                const data = rawData[month];
                plant1Data.push(data.plant1Produce || 0);
                plant2Data.push(data.plant2Produce || 0);
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
                        tooltipText += params.map(item => {
                            return `${item.marker} ${item.seriesName}: ₹${item.data.toLocaleString('en-IN')}`;
                        }).join('<br/>');
                        return tooltipText;
                    }
                },
                legend: { data: ['Plant 1', 'Plant 2'], top: 25 },
                xAxis: { type: 'category', data: months },
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
                    { name: 'Plant 1', type: 'line', data: plant1Data, itemStyle: { color: '#4caf50' } },
                    { name: 'Plant 2', type: 'line', data: plant2Data, itemStyle: { color: '#2196f3' } }
                ]
            });
        } catch (error) {
            console.error('Error fetching solar data:', error);
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

        // If it's the 1st day of the month, show just the month
        if (day === 1) {
            return `${monthNames[monthIndex]}`;
        }

        // Else, show full date
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
        setFilterType(range);
        setShowDropdown(false);
        const map = { 'YoY': -1, 'MoM': -3, 'Current Month': '0', 'Prev Month': -2 };
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
        fetchSolarData('0');

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

    // useEffect(() => {
    //     handleGetTotalSolarSummary();
    // }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Solar Plant Production Summary</h5>
                        <strong>
                            <span style={{ marginLeft: '90px' }}>
                                {filterType && `${filterType}`}
                            </span>
                        </strong>
                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-filter" style={{ cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)} />
                            {showDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                                    {['YoY', 'MoM', 'Current Month', 'Prev Month'].map(label => (
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
                            <strong>
                                <p className="mb-0">
                                    Units: {parseFloat(totalSolarSummaryData.plant1Produce || 0).toLocaleString('en-IN')}
                                </p></strong>
                        </div>
                        <div>
                            <h6>Plant-2</h6>
                            <strong>
                                <p className="mb-0">
                                    Units: {parseFloat(totalSolarSummaryData.plant2Produce || 0).toLocaleString('en-IN')}
                                </p></strong>
                        </div>
                    </div>
                </div>
            </div>

            {
                modalVisible && (
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
                )
            }
        </div >
    );
};

export default DashboardSolar;
