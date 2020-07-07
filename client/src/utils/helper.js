import React from "react";

export const parseQueryStr = str => {
  if (!str) return {};
  let obj = {};
  let lookup = {};
  let properties = str.split("&&");
  properties.forEach(property => {
    if (property.indexOf("filterBy") > -1 && property !== "filterBy=") {
      obj.filterBy = {};
      const filterItems = property.split("=")[1];
      filterItems.split(",").forEach(item => {
        var tup = item.split(":");
        if (tup[0] === "created_date") {
          obj["filterBy"][tup[0]] = tup[1];
        } else {
          if (lookup[tup[0]]) {
            let newArr = Array.isArray(lookup[tup[0]])
              ? lookup[tup[0]]
              : [lookup[tup[0]]];
            newArr.push(tup[1]);
            lookup[tup[0]] = newArr;
            obj["filterBy"][tup[0]] = lookup[tup[0]];
          } else {
            lookup[tup[0]] = tup[1];
            if (typeof tup[1] === String) {
              obj["filterBy"][tup[0]] = encodeURIComponent(tup[1]);
            } else {
              obj["filterBy"][tup[0]] = tup[1];
            }
          }
        }
      });
    } else {
      var tup = property.split("=");
      obj[tup[0]] = tup[1];
    }
  });
  return obj;
};

export const parseQueryObj = obj => {
  let newStr = "";
  Object.keys(obj).forEach((key, idx) => {
    if (idx > 0) {
      newStr += "&&";
    }
    if (key === "filterBy") {
      newStr += "filterBy=";
      Object.keys(obj[key]).forEach((filterKey, filterIdx) => {
        if (Array.isArray(obj[key][filterKey])) {
          let arr = obj[key][filterKey];
          arr.forEach((itm, itmIdx) => {
            newStr += `${filterKey}:${encodeURIComponent(itm)},`;
          });
        } else {
          newStr += `${filterKey}:${encodeURIComponent(obj[key][filterKey])},`;
        }
      });
    } else {
      newStr += `${key}=${obj[key]}`;
    }
  });
  if (newStr[newStr.length - 1] === ",") {
    newStr = newStr.slice(0, -1);
  }
  return newStr;
};

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

export const getTotal = (objKeys, data) => {
  const excludeList = ["y", "x", "_id"];
  let result = {};
  Object.keys(objKeys).forEach(key => {
    if (excludeList.indexOf(key) === -1) {
      result[`${key}Total`] = data.reduce((a, b) => a + b[key], 0);
    }
  });
  return result;
};

export const customTooltip = (ctx, tooltipModel) => {
  // Tooltip Element
  var tooltipEl = document.getElementById("chartjs-tooltip");

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "chartjs-tooltip";
    tooltipEl.innerHTML = "<table></table>";
    document.body.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove("above", "below", "no-transform");
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
    tooltipEl.classList.add("no-transform");
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltipModel.body) {
    var titleLines = tooltipModel.title || [];
    var bodyLines = tooltipModel.body.map(getBody);
    console.log(tooltipModel);

    var innerHtml = "<thead>";

    titleLines.forEach(function(title) {
      innerHtml += "<tr><th>" + title + "</th></tr>";
    });
    innerHtml += "</thead><tbody>";

    bodyLines.forEach(function(body, i) {
      var colors = tooltipModel.labelColors[i];
      var style = "background:" + colors.backgroundColor;
      style += "; border-color:" + colors.borderColor;
      style += "; border-width: 2px";
      var span = '<span style="' + style + '"></span>';
      innerHtml += "<tr><td>" + span + body + "</td></tr>";
    });
    innerHtml += "</tbody>";

    var tableRoot = tooltipEl.querySelector("table");
    tableRoot.innerHTML = innerHtml;
  }

  // `this` will be the overall tooltip
  var position = ctx._chart.canvas.getBoundingClientRect();

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.position = "absolute";
  tooltipEl.style.left =
    position.left + window.pageXOffset + tooltipModel.caretX + "px";
  tooltipEl.style.top =
    position.top + window.pageYOffset + tooltipModel.caretY + "px";
  tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
  tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
  tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
  tooltipEl.style.padding =
    tooltipModel.yPadding + "px " + tooltipModel.xPadding + "px";
  tooltipEl.style.pointerEvents = "none";
};

export const getColorScheme = (num, opacity) => {
  let colorLib = [
    "255, 99, 132",
    "54, 162, 235",
    "255, 206, 86",
    "75, 192, 192",
    "153, 102, 255",
    "255, 159, 64"
  ];
  let result = [];

  for (var i = 0; i < num; i++) {
    let rotateColor = colorLib[i % colorLib.length];
    result.push(`rgba(${rotateColor}, ${opacity})`);
  }
  return result;
};

export const getFormattedNumber = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
