// import React, { Component } from 'react';
// import CanvasJSReact from '@canvasjs/react-charts';

// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// class DashboardWaterfallChart extends Component {
//     render() {
//         const options = {
//             theme: "light2",
//             title: {
//                 text: "Company Sales Report"
//             },
//             animationEnabled: true,
//             axisX: {
//                 interval: 1
//             },
//             axisY: {
//                 valueFormatString: "\u20B9#,##0,.L",
//                 title: "Amount (in INR)"
//             },
//             data: [{
//                 type: "waterfall",
//                 yValueFormatString: "\u20B9#,##0,.00L",
//                 indexLabel: "{y}",
//                 indexLabelPlacement: "inside",
//                 risingColor: "#4CAF50",
//                 fallingColor: "#F44336",
//                 dataPoints: [
//                     { label: "Jan", y: 8312 },
//                     { label: "Feb", y: 5065 },
//                     { label: "Mar", y: -2564 },
//                     { label: "Apr", y: 7004 },
//                     { label: "May", y: 4324 },
//                     { label: "Jun", y: -3543 },
//                     { label: "July", y: 4008 },
//                     { label: "Sep", y: -6997 },
//                     { label: "Aug", y: 5673 },
//                     { label: "Oct", y: 6654 },
//                     { label: "Nov", y: -4943 },
//                     { label: "Dec", y: 6324 },
//                     { label: "Final", isCumulativeSum: true, indexLabel: "{y}", color: "#2196F3" }
//                 ]
//             }]
//         };

//         return (
//             <div>
//                 <CanvasJSChart options={options} />
//             </div >
//         );
//     }
// }
// export default DashboardWaterfallChart;                              




import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DashboardWaterfallChart = ({ dataPoints }) => {
    const formatIndianNumber = (value) => {
        if (value >= 1_00_00_000) return (value / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        if (value >= 1_00_000) return (value / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L';
        if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return value;
    };

    const options = {
        theme: "light2",
        title: {
            // text: "Bank Summary Waterfall Chart"
        },
        animationEnabled: true,
        axisX: {
            interval: 1
        },
        axisY: {
            // title: "Amount (INR)",
            labelFormatter: function (e) {
                return formatIndianNumber(e.value);
            }
        },
        data: [{
            type: "waterfall",
            indexLabelFormatter: function (e) {
                return formatIndianNumber(e.dataPoint.y);
            },
            indexLabelPlacement: "inside",
            risingColor: "#4CAF50",
            fallingColor: "#F44336",
            dataPoints: dataPoints
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default DashboardWaterfallChart;
