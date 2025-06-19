import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const DashboardElectricitySummary = () => {

    const electricityChartRef = useRef(null);

    useEffect(() => {
        const electricityChartInstance = echarts.init(electricityChartRef.current);

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

        electricityChartInstance.setOption(electricityOption);

        const handleResize = () => {
            electricityChartInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            electricityChartInstance.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Electricity Summary</h5>
                    <div ref={electricityChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardElectricitySummary