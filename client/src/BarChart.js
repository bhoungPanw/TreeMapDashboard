import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

import { getTotal, getColorScheme, getFormattedNumber } from "./utils/helper";

class BarChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, query, label, xLabel } = this.props;
    data.forEach(obj => {
      obj.y = obj[query.sortBy];
    });
    return (
      <Bar
        data={{
          labels: data.map(item => item._id[xLabel]),
          datasets: [
            {
              label: label,
              backgroundColor: function(data) {
                let x = data.dataset.data;
                return getColorScheme(x.length, 1);
              },
              borderColor: function(data) {
                let x = data.dataset.data;
                return getColorScheme(x.length, 0.2);
              },
              borderWidth: 1,
              data: data
            }
          ]
        }}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  // fontColor: "white",
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                    return getFormattedNumber(value);
                  }
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  // fontColor: "white"
                }
              }
            ]
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: true,
            callbacks: {
              label: function(tooltipItems, data) {
                return (
                  tooltipItems.xLabel +
                  " : " +
                  getFormattedNumber(tooltipItems.yLabel)
                );
              },
              afterBody: function(tooltipItems, data) {
                // console.log(tooltipItems, data);
                let results = [];
                let currentDataPoint =
                  data.datasets[0].data[tooltipItems[0].index];
                const excludeList = ["y", "x", "_id"];
                const listofTotal = getTotal(
                  currentDataPoint,
                  data.datasets[0].data
                );
                // console.log(tooltipItems, currentDataPoint);
                Object.keys(currentDataPoint).forEach(key => {
                  if (excludeList.indexOf(key) === -1) {
                    let totalKey = key + "Total";
                    let keyPercentage = (
                      (currentDataPoint[key] / listofTotal[totalKey]) *
                      100
                    ).toFixed(2);
                    let formatValue = getFormattedNumber(currentDataPoint[key]);
                    results.push(`${key}: ${formatValue}`);
                    results.push(`${key} %: ${keyPercentage}%`);
                  }
                });
                return results;
              }
            }
          }
        }}
      />
    );
  }
}

export default BarChart;
