import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const DashboardRentSummary = () => {

    const rentChartRef = useRef(null);

    useEffect(() => {
        const rentChartInstance = echarts.init(rentChartRef.current);

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

        rentChartInstance.setOption(rentOption);

        const handleResize = () => {
            rentChartInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            rentChartInstance.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Rent Summary</h5>
                    <div ref={rentChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardRentSummary