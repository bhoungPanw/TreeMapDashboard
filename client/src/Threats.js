import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import { parseQueryStr, parseQueryObj } from "./utils/helper";
import ThreatControls from "./ThreatControls";
import BarChart from "./BarChart";

const appType = ["Top 25 SaaS-based Applications", "Remote Access Tool Usage"];

class Applications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryFilterObj: [],
      label: "Top Threats",
      queryParams: "sortBy=samples",
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
    }
    console.log("------------------------------------");
    console.log(currQuery);
    console.log("------------------------------------");
    newParams = parseQueryObj(currQuery);
    this.handleRefreshQuery(newParams, newAppType);
  };

  handleRefreshQuery = (query, label) => {
    // this.setState({ queryFilterObj: defaultFilterObj });
    axios.get("/api/threats?" + query).then(res => {
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
    const { queryFilterObj, queryParams, label, isLoading } = this.state;
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
            xLabel="tag_name"
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
    const { isLoading, threatCategories, industries } = this.state;
    return (
      <div>
        <h4 className="section-title">Threats Data</h4>
        <ThreatControls
          handleClick={this.handleRefreshQuery}
          handleFilterChange={this.handleFilterChange}
          threatData={threatCategories}
          loading={isLoading}
          industries={industries}
        />
        {this.renderLoading()}
      </div>
    );
  }
}
export default Applications;
