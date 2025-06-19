import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const DashboardGopalAyaanSaleTrends = () => {

    const lineChartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(lineChartRef.current);

        const option = {
            title: {
                text: 'Sales Trend & Share',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['Gopal', 'Ayaan Cinema', 'Altruist Share'],
                top: 25,
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'Gopal',
                    type: 'line',
                    smooth: true,
                    data: [120, 132, 101, 134, 90, 230, 210],
                    lineStyle: {
                        color: '#4caf50',
                    },
                    itemStyle: {
                        color: '#4caf50',
                    },
                },
                {
                    name: 'Ayaan Cinema',
                    type: 'line',
                    smooth: true,
                    data: [220, 182, 191, 234, 290, 330, 310],
                    lineStyle: {
                        color: '#ff9800',
                    },
                    itemStyle: {
                        color: '#ff9800',
                    },
                },
                {
                    name: 'Altruist Share',
                    type: 'line',
                    smooth: true,
                    data: [15, 15, 15, 15, 15, 15, 15],
                    lineStyle: { color: '#2196f3' },
                },
            ],
        };

        chartInstance.setOption(option);

        const handleResize = () => {
            chartInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            chartInstance.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Gopal & Ayaan Cinema Sale Summary</h5>
                    <div ref={lineChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGopalAyaanSaleTrends