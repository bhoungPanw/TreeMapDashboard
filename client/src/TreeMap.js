import React, { Component } from "react";
import ReactEcharts from "echarts-for-react"; // or var ReactEcharts = require('echarts-for-react');
import echarts from "echarts/lib/echarts";
import axios from "axios";
import { getWindowDimensions } from "./utils/helper";

const household_america_2012 = 113616229;
const formatUtil = echarts.format;
const modes = ["All Risk Levels"];

class TreeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        leftOffset: 420,
        rightOffset: 300
      }
    };
  }

  componentDidMount() {}

  buildTreeData = (mode, treeData) => {
    const { dataSource, query } = this.props;
    const colors = ["#7E7E7E", "#27AE60", "#F2C94C", "#F2994A", "#EB5757"];
    const theatreColors = {
      NAM: "#27AE60",
      EMEA: "#F2C94C",
      APAC: "#F2994A",
      JP: "#EB5757"
    };
    treeData.forEach((item, idx) => {
      const datapoint =
        dataSource === 0 ? item._id.risk_level : item._id.theatre;
      item.name = datapoint;
      item.value = item.sessions ? [item[query.sortBy]] : [item.samples];
      item.children.forEach(child => {
        if (dataSource === 0) {
          child.value = [child[query.sortBy]];
        } else {
          if (child.samples) {
            child.value = [child.samples];
          } else {
            child.value = [];
          }
          if (child.sessions) {
            child.value.push(child.sessions);
          }
        }
      });
      item.itemStyle =
        dataSource === 0
          ? { color: colors[datapoint - 1] }
          : { color: theatreColors[datapoint] };
    });
    return treeData;
  };

  buildData = (mode, originList) => {
    let out = [];
    for (var i = 0; i < originList.length; i++) {
      var node = originList[i];
      var newNode = (out[i] = this.cloneNodeInfo(node));
      var value = newNode.value;

      if (!newNode) {
        continue;
      }

      // Calculate amount per household.
      value[3] = value[0] / household_america_2012;

      // if mode === 0 and mode === 2 do nothing
      if (mode === 1) {
        // Set 'Change from 2010' to value[0].
        var tmp = value[1];
        value[1] = value[0];
        value[0] = tmp;
      }

      if (node.children) {
        newNode.children = this.buildData(mode, node.children);
      }
    }

    return out;
  };

  cloneNodeInfo = node => {
    if (!node) {
      return;
    }

    var newNode = {};
    newNode.name = node.name;
    newNode.id = node.id;
    newNode.discretion = node.discretion;
    newNode.value = (node.value || []).slice();
    return newNode;
  };

  getLevelOption = mode => {
    return [
      {
        itemStyle: {
          normal: {
            borderColor: "#777",
            borderWidth: 0,
            gapWidth: 1
          }
        }
      },
      {
        itemStyle: {
          normal: {
            borderColor: "#555",
            borderWidth: 5,
            gapWidth: 1
          },
          emphasis: {
            borderColor: "#ddd"
          }
        }
      },
      {
        // color: ["#942e38", "#269f3c"],
        // colorSaturation: [0.35, 0.5]
        itemStyle: {
          normal: {
            borderColor: "#555",
            borderWidth: 5,
            gapWidth: 1,
            borderColorSaturation: 0.6
          }
        }
      }
    ];
  };

  isValidNumber = num => {
    return num != null && isFinite(num);
  };

  getTooltipFormatter = mode => {
    var amountIndex = mode === 1 ? 1 : 0;
    var amountIndex2011 = mode === 1 ? 0 : 1;
    const self = this;

    return function(info) {
      var value = info.value;

      var amount = value[amountIndex];
      amount = self.isValidNumber(amount)
        ? formatUtil.addCommas(amount * 1000) + "$"
        : "-";

      var amount2011 = value[amountIndex2011];
      amount2011 = self.isValidNumber(amount2011)
        ? formatUtil.addCommas(amount2011 * 1000) + "$"
        : "-";

      var perHousehold = value[3];
      perHousehold = self.isValidNumber(perHousehold)
        ? formatUtil.addCommas(+perHousehold.toFixed(4) * 1000) + "$"
        : "-";

      var change = value[2];
      change = self.isValidNumber(change) ? change.toFixed(2) + "%" : "-";

      return [
        '<div class="tooltip-title">' +
          formatUtil.encodeHTML(info.name) +
          "</div>",
        "2012 Amount: &nbsp;&nbsp;" + amount + "<br>",
        "Per Household: &nbsp;&nbsp;" + perHousehold + "<br>",
        "2011 Amount: &nbsp;&nbsp;" + amount2011 + "<br>",
        "Change From 2011: &nbsp;&nbsp;" + change
      ].join("");
    };
  };

  createSeriesCommon = mode => {
    const { dataSource, query } = this.props;
    return {
      type: "treemap",
      tooltip: {
        // formatter: this.getTooltipFormatter(mode)
      },
      label: {
        normal: {
          position: "insideTopLeft",
          formatter: function(params) {
            let label = query.sortBy;
            let value = params.value[0];
            if (query.sortBy === "bytes") {
              label = "terabytes";
              value = params.value[0] / 1e12;
            }
            var arr = [
              "{name|" + params.name + "}",
              "{hr|}",
              "{primaryLabel|" +
                echarts.format.addCommas(value) +
                "} {label|" +
                label +
                "}"
            ];
            if (params.data.bytes && query.sortBy !== "bytes") {
              arr.push(
                "{secondaryLabel|" +
                  echarts.format.addCommas(
                    (params.data.bytes / 1e12).toFixed()
                  ) +
                  "} {label|terabytes}"
              );
            }
            if (params.data.sessions && query.sortBy !== "sessions") {
              arr.push(
                "{secondaryLabel|" +
                  echarts.format.addCommas(params.data.sessions) +
                  "} {label|sessions}"
              );
            }

            return arr.join("\n");
          },
          rich: {
            primaryLabel: {
              fontSize: 22,
              lineHeight: 30,
              color: "yellow"
            },
            secondaryLabel: {
              fontSize: 14,
              color: "#fff"
            },
            label: {
              fontSize: 9,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "#fff",
              borderRadius: 2,
              padding: [2, 4],
              lineHeight: 25,
              align: "right"
            },
            name: {
              fontSize: 12,
              color: "#fff"
            },
            hr: {
              width: "100%",
              borderColor: "rgba(255,255,255,0.2)",
              borderWidth: 0.5,
              height: 0,
              lineHeight: 10
            }
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: "black"
        }
      },
      levels: this.getLevelOption(0)
    };
  };

  getOption = () => {
    const { treeData, filterObj, dataSource, query } = this.props;
    const { config } = this.state;
    const { innerWidth: width, innerHeight: height } = window;
    const self = this;
    const modeName = dataSource === 0 ? "Risk Levels" : "Theaters";
    return {
      title: {
        top: 5,
        left: "center",
        text: dataSource === 0 ? "Application Data" : "Threat Data",
        // subtext: dataSource === 0 ? "SLR data" : "Autfocus data",
        backgroundColor: "#262626",
        padding: 5,
        borderRadius: [5, 5, 0, 0],
        show: true,
        textStyle: {
          color: "white"
        }
      },
      legend: {
        data: [5, 4, 3, 2, 1],
        selectedMode: "single",
        top: 55,
        itemGap: 5,
        backgroundColor: "rgb(243,243,243)",
        borderRadius: 5,
        show: false
      },

      tooltip: {},
      toolbox: {
        show: true,
        showTitle: false,
        right: width < 1025 ? 20 : 300,
        top: 20,
        feature: {
          restore: {
            show: true,
            iconStyle: {
              borderColor: "white",
              borderWidth: 2
            }
          }
        }
      },

      series: modes.map(function(mode, idx) {
        let seriesOpt = self.createSeriesCommon(idx);
        seriesOpt.name = modeName;
        seriesOpt.top = 80;
        seriesOpt.left = 380;
        seriesOpt.right = 300;
        seriesOpt.roam = "pan";
        seriesOpt.data = self.buildTreeData(idx, treeData);
        seriesOpt.levels = self.getLevelOption(idx);
        seriesOpt.breadcrumb = {
          itemStyle: {
            color: "#262626",
            borderColor: "#262626",
            borderWidth: 0,
            textStyle: {
              color: "#727272",
              fontSize: 12
            }
          }
        };
        if (width < 1025) {
          seriesOpt.right = 20;
          seriesOpt.left = 20;
        }
        return seriesOpt;
      })
    };
  };

  render() {
    const { isLoading, filterObj } = this.props;
    return (
      <ReactEcharts
        option={this.getOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        showLoading={isLoading}
        //   onChartReady={this.onChartReadyCallback}
        //   onEvents={EventsDict}
        //   opts={}
      />
    );
  }
}

export default TreeMap;
