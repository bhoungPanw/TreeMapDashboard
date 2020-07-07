import React, { Component } from "react";
import axios from "axios";
import TreeMap from "./TreeMap";

import { parseQueryStr, parseQueryObj } from "./utils/helper";
import ControlWrapper from "./ControlWrapperComponent";
import TopList from "./Toplist";

class ApplicationsTreeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: 0,
      queryFilterObj: [],
      label: "All Applications",
      applicationQueryParams: "sortBy=sessions",
      threatsQueryParams: "sortBy=samples",
      treeData: [],
      isLoading: true,
      industries: [],
      threatCategories: [
        { name: "Malware Families", value: "malware_family" },
        { name: "Malware Campaigns", value: "campaign" },
        { name: "Malicious Behavior Tags", value: "malicious_behavior" },
        { name: "Tag Groups", value: "tag_group" },
        { name: "Threat Actors", value: "actor" },
        { name: "File Types", value: "filetype" },
        { name: "Applications Delivering Malware", value: "app" }
      ]
    };
  }

  componentDidMount() {
    const { applicationQueryParams, label } = this.state;
    this.handleRefreshQuery(0, applicationQueryParams, label);
  }

  handleFilterChange = (source, category, eventValue) => {
    this.setState({ isLoading: true });
    const { applicationQueryParams, label, threatsQueryParams } = this.state;
    let currQuery =
      source === 0
        ? parseQueryStr(applicationQueryParams)
        : parseQueryStr(threatsQueryParams);
    const appType = [
      "Top 25 SaaS-based Applications",
      "Remote Access Tool Usage"
    ];
    let newParams,
      newAppType = label;
    switch (category) {
      case "appType":
        newAppType = appType[eventValue];
        if (eventValue === "All") {
          delete currQuery.filterBy.is_saas_based;
          delete currQuery.filterBy.subcategory;
          newAppType = "All Applications";
        } else if (eventValue === "0") {
          currQuery.filterBy = { is_saas_based: 1 };
          newAppType = "Top 25 SaaS-based Applications";
        } else if (eventValue === "1") {
          currQuery.filterBy = { subcategory: "remote-access" };
          newAppType = "Remote Access Tool Usage";
        }
        break;
      case "tagClass":
        if (currQuery.filterBy) {
          currQuery.filterBy.tag_class = eventValue;
        } else {
          currQuery.filterBy = {
            tag_class: eventValue
          };
        }
        break;
      case "industry":
        if (eventValue === "All" || eventValue.length < 1) {
          if (currQuery.filterBy && currQuery.filterBy.industry) {
            delete currQuery.filterBy.industry;
          }
        } else if (currQuery.filterBy) {
          currQuery.filterBy.industry = eventValue;
        } else {
          currQuery.filterBy = {
            industry: eventValue
          };
        }
        break;
      case "theatre":
        if (eventValue === "All") {
          delete currQuery.filterBy.theatre;
        } else if (currQuery.filterBy) {
          currQuery.filterBy.theatre = eventValue;
        } else {
          currQuery.filterBy = {
            theatre: eventValue
          };
        }
        break;
      case "riskLevel":
        if (eventValue === "All") {
          delete currQuery.filterBy.risk_level;
        } else if (currQuery.filterBy) {
          currQuery.filterBy.risk_level = eventValue;
        } else {
          currQuery.filterBy = {
            risk_level: eventValue
          };
        }
        break;
      case "month":
        if (eventValue === "All") {
          delete currQuery.filterBy.month;
        } else if (currQuery.filterBy) {
          currQuery.filterBy.month = eventValue;
        } else {
          currQuery.filterBy = {
            month: eventValue
          };
        }
        break;
      case "year":
        if (eventValue === "All") {
          delete currQuery.filterBy.year;
        } else if (currQuery.filterBy) {
          currQuery.filterBy.year = JSON.stringify(eventValue);
        } else {
          currQuery.filterBy = {
            year: JSON.stringify(eventValue)
          };
        }
        break;
      case "sortBy":
        currQuery.sortBy = eventValue;
        break;
    }
    newParams = parseQueryObj(currQuery);
    this.handleRefreshQuery(source, newParams, newAppType);
  };

  handleRefreshQuery = (source, query, label) => {
    if (source === 0) {
      let promises = [
        axios.get("/api/applicationsgroups?" + query),
        axios.get("/api/applications/industries")
      ];
      Promise.all(promises).then(res => {
        if (res[0].status === 200 && res[1].status === 200) {
          let stateObj = {
            applicationQueryParams: query,
            treeData: res[0].data.data,
            label: label,
            isLoading: false,
            dataSource: source,
            industries: res[1].data.data
          };
          // if (query.indexOf("industry") === -1) {
          //   stateObj.industries = res.data.data[0].industries;
          // }
          this.setState(stateObj);
        }
      });
    } else if (source === 1) {
      let promises = [
        axios.get("/api/threats?" + query),
        axios.get("/api/threats/industries")
      ];
      Promise.all(promises).then(res => {
        if (res[0].status === 200 && res[1].status === 200) {
          let stateObj = {
            threatsQueryParams: query,
            treeData: res[0].data.data,
            label: label,
            isLoading: false,
            dataSource: source,
            industries: res[1].data.data
          };
          // if (query.indexOf("industry") === -1) {
          //   stateObj.industries = res.data.data[0].industries;
          // }
          this.setState(stateObj);
        }
      });
    }
  };

  render() {
    const {
      treeData,
      isLoading,
      industries,
      applicationQueryParams,
      threatsQueryParams,
      dataSource,
      threatCategories
    } = this.state;
    const currQuery =
      dataSource === 0
        ? parseQueryStr(applicationQueryParams)
        : parseQueryStr(threatsQueryParams);
    return (
      <div className="treemap">
        <ControlWrapper
          handleRefreshQuery={this.handleRefreshQuery}
          handleFilterChange={this.handleFilterChange}
          isLoading={isLoading}
          industries={industries}
          dataSource={dataSource}
          threatCategories={threatCategories}
        />
        <TreeMap
          treeData={treeData}
          isLoading={isLoading}
          dataSource={dataSource}
          query={currQuery}
        />
        <TopList data={treeData} query={currQuery} dataSource={dataSource} />
      </div>
    );
  }
}

export default ApplicationsTreeMap;
