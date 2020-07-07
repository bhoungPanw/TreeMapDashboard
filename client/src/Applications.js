import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import { parseQueryStr, parseQueryObj } from "./utils/helper";
import Controls from "./Controls";
import BarChart from "./BarChart";

const appType = ["Top 25 SaaS-based Applications", "Remote Access Tool Usage"];

class Applications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryFilterObj: [],
      label: "All Applications",
      queryParams: "sortBy=sessions",
      isLoading: true,
      industries: []
    };
  }
  componentDidMount() {
    const { queryParams, label } = this.state;
    this.handleRefreshQuery(queryParams, label);
    axios.get("/api/industries").then(res => {
      if (res.status === 200) {
        this.setState({
          industries: res.data.data
        });
      }
    });
  }
  handleFilterChange = (category, eventValue) => {
    this.setState({ isLoading: true });
    const { queryParams, label } = this.state;
    let currQuery = parseQueryStr(queryParams);
    let newParams,
      newAppType = label;
    switch (category) {
      case "appType":
        newAppType = appType[eventValue];
        if (eventValue === "All") {
          delete currQuery.filterBy.is_saas_based;
          delete currQuery.filterBy.subcategory;
          newAppType = "All Applications";
        } else if (eventValue === "1") {
          currQuery.filterBy = { is_saas_based: 1 };
          newAppType = "Top 25 SaaS-based Applications";
        } else if (eventValue === "2") {
          currQuery.filterBy = { subcategory: "remote-access" };
          newAppType = "Remote Access Tool Usage";
        }
        break;
      case "industry":
        if (eventValue === "All") {
          delete currQuery.filterBy.industry;
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
    this.handleRefreshQuery(newParams, newAppType);
  };

  handleRefreshQuery = (query, label) => {
    // this.setState({ queryFilterObj: defaultFilterObj });
    axios.get("/api/applications?" + query).then(res => {
      if (res.status === 200) {
        this.setState({
          queryParams: query,
          queryFilterObj: res.data.data,
          label: label,
          isLoading: false
        });
      }
    });
  };

  renderLoading = () => {
    const {
      queryFilterObj,
      queryParams,
      label,
      isLoading,
      industries
    } = this.state;
    const parsedQuery = parseQueryStr(queryParams);
    return !isLoading ? (
      <div className="card">
        <div className="header">
          <h4 className="title">{label}</h4>
          <p className="category">
            by <span className="capitalize">{parsedQuery.sortBy}</span>
          </p>
        </div>
        <div className="content">
          <BarChart
            data={queryFilterObj}
            query={parsedQuery}
            label={label}
            xLabel="app_name"
          />
        </div>
      </div>
    ) : (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  };

  render() {
    const { isLoading, industries } = this.state;
    return (
      <div>
        <h4 className="title">Application Data</h4>
        <Controls
          handleClick={this.handleRefreshQuery}
          handleFilterChange={this.handleFilterChange}
          loading={isLoading}
          industries={industries}
        />
        {this.renderLoading()}
      </div>
    );
  }
}
export default Applications;
