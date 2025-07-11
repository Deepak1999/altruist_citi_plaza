import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DashboardWaterfallChart = ({ dataPoints }) => {
    
    const formatIndianNumber = (value) => {
        if (typeof value !== "number") return "";
        const absValue = Math.abs(value);
        let formatted;
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
    };

    const options = {
        theme: "light2",
        animationEnabled: true,
        axisX: {
            interval: 1
        },
        axisY: {
            labelFormatter: function (e) {
                return formatIndianNumber(e.value);
            }
        },
        data: [{
            type: "waterfall",
            indexLabelPlacement: "outside",
            indexLabelFontWeight: "bold",
            indexLabelFontColor: "#333",
            risingColor: "#4CAF50",
            fallingColor: "#F44336",
            dataPoints: dataPoints.map(dp => ({
                ...dp,
                indexLabel:
                    typeof dp.y === "number"
                        ? String(formatIndianNumber(dp.y))
                        : undefined
            }))
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default DashboardWaterfallChart;