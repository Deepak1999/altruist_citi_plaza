import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';

const DashboardRentSummary = () => {
    const rentChartRef = useRef(null);
    const rentChartInstanceRef = useRef(null);

    const [showRentDropdown, setShowRentDropdown] = useState(false);
    const [rentFilter, setRentFilter] = useState('6 Months');
    const [filterType, setFilterType] = useState('6 Months');
    const [totalRentSummaryData, setTotalRentSummaryData] = useState({
        totalRentAmount: 0,
        rentPaid: 0,
        rentPending: 0
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState([]);
    const [modalRows, setModalRows] = useState([]);

    const fetchRentData = async (period) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const resp = await fetch(`${ApiBaseUrl}/dashboard/rent-summary?period=${period}`, {
                headers: { userId }
            });
            const json = await resp.json();
            const rentDetails = json.dashboardRentSummaryDetails || {};

            setTotalRentSummaryData(json.totalData.total || {});

            const months = Object.keys(rentDetails).sort();
            const totalRent = [], rentPaid = [], rentPending = [];

            months.forEach(month => {
                const d = rentDetails[month];
                totalRent.push(+d.totalRentAmount);
                rentPaid.push(+d.rentPaid);
                rentPending.push(+d.rentPending);
            });

            const chart = rentChartInstanceRef.current;
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
                    data: ['Total Rent', 'Rent Collected', 'Rent Pending'],
                    top: 25
                },
                xAxis: {
                    type: 'category',
                    data: months
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value) {
                            const absValue = Math.abs(value);
                            let formatted = '';
                            if (absValue >= 1_00_00_000) {
                                formatted = (absValue / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
                            } else if (absValue >= 1_00_000) {
                                formatted = (absValue / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
                            } else if (absValue >= 1000) {
                                formatted = (absValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                            } else {
                                formatted = absValue.toString();
                            }

                            return value < 0 ? `-${formatted}` : formatted;
                        }
                    }
                },
                series: [
                    {
                        name: 'Total Rent',
                        type: 'line',
                        // data: totalRent,
                        data: totalRent.map(val => Math.round(val)),
                        itemStyle: { color: '#4caf50' }
                    },
                    {
                        name: 'Rent Collected',
                        type: 'line',
                        // data: rentPaid,
                        data: rentPaid.map(val => Math.round(val)),
                        itemStyle: { color: '#0baade' }
                    },
                    {
                        name: 'Rent Pending',
                        type: 'line',
                        // data: rentPending,
                        data: rentPending.map(val => Math.round(val)),
                        itemStyle: { color: '#ff9800' }
                    }
                ]
            });
        } catch (err) {
            console.error(err);
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

    const formatYearMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const date = new Date(`${year}-${month}-01`);
        return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    };

    const fetchDetails = async (category, yearMonth, seriesName) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const body = {
            group: 1,
            category,
            yearMonth
        };

        try {
            const resp = await fetch(`${ApiBaseUrl}/dashboard/consolidated-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId
                },
                body: JSON.stringify(body)
            });
            const json = await resp.json();
            if (json.statusDescription.statusCode !== 200) {
                console.error('API error', json);
                return;
            }
            const data = json.data || {};

            if (Object.keys(data).length === 0) {
                // setModalTitle(`${seriesName} • ${yearMonth}`);
                setModalColumns([]);
                setModalRows([]);
                setModalVisible(true);
                return;
            }

            const firstItem = data[Object.keys(data)[0]];
            const cols = Object.keys(firstItem).map(key => ({
                key,
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
            }));
            const rows = Object.entries(data).map(([id, item]) => ({
                id,
                ...item
            }));

            setModalTitle(`${seriesName} • ${formatYearMonth(yearMonth)}`);
            setModalColumns(cols);
            setModalRows(rows);
            setModalVisible(true);
        } catch (err) {
            console.error(err);
        }
    };

    const updateRentChart = (range) => {
        setRentFilter(range);
        setFilterType(range);
        setShowRentDropdown(false);
        const map = { 'YoY': -1, 'MoM': -3, 'Current Month': '0', 'Prev Month': -2, '3 Months': 3, '6 Months': 6, '9 Months': 9, '12 Months': 12 };
        if (map[range]) fetchRentData(map[range]);
    };

    useEffect(() => {
        const chart = echarts.init(rentChartRef.current);
        rentChartInstanceRef.current = chart;

        chart.on('click', params => {
            const month = params.name;
            const series = params.seriesName;
            let cat;
            if (series === 'Total Rent') cat = 1;
            else if (series === 'Rent Collected') cat = 2;
            else if (series === 'Rent Pending') cat = 3;
            else return;

            fetchDetails(cat, month, series);
        });

        window.addEventListener('resize', chart.resize);
        fetchRentData(6);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', chart.resize);
        };
    }, []);

    const handleGetTotalRentSummary = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/rent-summary?period=-1`, {
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
                    const summary = data.dashboardRentSummaryDetails?.total;

                    if (summary) {
                        setTotalRentSummaryData(summary);
                    } else {
                        toast.success(description || 'Rent summary data is missing.');
                    }
                } else {
                    toast.error(description || 'Failed to fetch rent summary.');
                }
            } else {
                toast.error('Request failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    // useEffect(() => {
    //     handleGetTotalRentSummary();
    // }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    {/* Header + filter */}
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Rent Summary</h5>
                        <strong>
                            <span style={{ marginLeft: '220px' }}>
                                {filterType && `${filterType}`}
                            </span>
                        </strong>
                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-filter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowRentDropdown(!showRentDropdown)} />
                            {showRentDropdown && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                                    {['YoY', 'MoM', 'Current Month', 'Prev Month', '3 Months', '6 Months', '9 Months', '12 Months'].map(r => (
                                        <button key={r} className="dropdown-item" onClick={() => updateRentChart(r)}>
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div ref={rentChartRef} style={{ width: '100%', height: '330px', marginTop: '15px' }} />

                    <div className="d-flex justify-content-around text-center mt-3">
                        <div>
                            <h6>Billed Rent</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalRentSummaryData.totalRentAmount || 0).toLocaleString('en-IN')}
                            </p></strong>
                        </div>
                        <div>
                            <h6>Collected</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalRentSummaryData.rentPaid || 0).toLocaleString('en-IN')}
                            </p></strong>
                        </div>
                        <div>
                            <h6>Pending</h6>
                            <strong><p className="mb-0">
                                ₹{parseFloat(totalRentSummaryData.rentPending || 0).toLocaleString('en-IN')}
                            </p></strong>
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
                                {modalColumns.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {modalColumns.map(col => (
                                                    <th key={col.key}>{col.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        {/* <tbody>
                                            {modalRows.map((row, i) => (
                                                <tr key={i}>
                                                    {modalColumns.map(col => (
                                                        <td key={col.key}>{row[col.key]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody> */}
                                        <tbody>
                                            {modalRows.map((row, i) => (
                                                <tr key={i}>
                                                    {modalColumns.map(col => (
                                                        <td key={col.key}>
                                                            {typeof row[col.key] === 'number'
                                                                ? new Intl.NumberFormat('en-IN').format(row[col.key])
                                                                : row[col.key]}
                                                        </td>
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

export default DashboardRentSummary;