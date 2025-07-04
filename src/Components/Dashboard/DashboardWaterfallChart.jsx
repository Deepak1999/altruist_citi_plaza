import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DashboardWaterfallChart = ({ dataPoints }) => {
    const formatIndianNumber = (value) => {
        if (typeof value !== "number") return "";
        if (value >= 1_00_00_000) return (value / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        if (value >= 1_00_000) return (value / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
        if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return value.toString();  // Ensure it's a string
    };

    // const options = {
    //     theme: "light2",
    //     title: {
    //         // text: "Bank Summary Waterfall Chart"
    //     },
    //     animationEnabled: true,
    //     axisX: {
    //         interval: 1
    //     },
    //     axisY: {
    //         // title: "Amount (INR)",
    //         labelFormatter: function (e) {
    //             return formatIndianNumber(e.value);
    //         }
    //     },
    //     data: [{
    //         type: "waterfall",
    //         indexLabelFormatter: function (e) {
    //             return formatIndianNumber(e.dataPoint.y);
    //         },
    //         indexLabelPlacement: "inside",
    //         risingColor: "#4CAF50",
    //         fallingColor: "#F44336",
    //         dataPoints: dataPoints
    //     }]
    // };

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