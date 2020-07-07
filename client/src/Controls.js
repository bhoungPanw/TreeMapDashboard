import React, { Component } from "react";
import {
  ButtonToolbar,
  Form,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import Select from "react-select";

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterObj: {
        appType: "is_saas_based",
        sortBy: "sessions",
        region: "all"
      },
      selectedIndustry: null
    };
  }

  render() {
    const { selectedIndustry } = this.state;
    const { handleFilterChange, loading, industries } = this.props;
    const options = industries.map(industry => {
      return { value: industry, label: industry };
    });
    return (
      <div>
        <Form.Group controlId="formGridState">
          <Form.Label>App Types</Form.Label>
          <Form.Control
            as="select"
            disabled={loading}
            onChange={e => handleFilterChange(0, "appType", e.target.value)}
          >
            <option value={"All"}>All App Types...</option>
            {[
              { label: "SaaS-based Applications", val: 0 },
              { label: "Remote Access Tool Usage", val: 1 }
            ].map(app => {
              return (
                <option key={app.val} value={app.val}>
                  {app.label}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridState">
          <div className="select-wrapper">
            <Form.Label>Industry</Form.Label>
            <button
              className="btn btn-primary btn-sm apply-select"
              onClick={() => {
                if (selectedIndustry) {
                  handleFilterChange(
                    0,
                    "industry",
                    selectedIndustry.map(industry => industry.value)
                  );
                } else {
                  handleFilterChange(0, "industry", "All");
                }
              }}
            >
              Apply
            </button>
            <br />
            <Select
              isMulti
              className="multi-select"
              isDisabled={loading}
              value={selectedIndustry}
              onChange={selectedIndustry => {
                this.setState({ selectedIndustry });
              }}
              options={options}
            />
          </div>

          {/* <Form.Control
            as="select"
            disabled={loading}
            onChange={e => handleFilterChange(0, "industry", e.target.value)}
          >
            <option value={"All"}>All Industries...</option>
            {industries.map(industry => {
              return (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              );
            })}
          </Form.Control> */}
        </Form.Group>
        <ButtonToolbar>
          <Form.Label>Theater</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={"All"}
            onChange={e => {
              handleFilterChange(0, "theatre", e);
            }}
          >
            <ToggleButton disabled={loading} value={"All"}>
              All
            </ToggleButton>
            <ToggleButton disabled={loading} value={"NAM"}>
              NAM
            </ToggleButton>
            <ToggleButton disabled={loading} value={"EMEA"}>
              EMEA
            </ToggleButton>
            <ToggleButton disabled={loading} value={"APAC"}>
              APAC
            </ToggleButton>
            <ToggleButton disabled={loading} value={"JP"}>
              JP
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <ButtonToolbar>
          <Form.Label>Sort By</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={"sessions"}
            onChange={e => {
              handleFilterChange(0, "sortBy", e);
            }}
          >
            <ToggleButton disabled={loading} value={"sessions"}>
              Sessions
            </ToggleButton>
            <ToggleButton disabled={loading} value={"bytes"}>
              Bytes
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <ButtonToolbar>
          <Form.Label>Risk Level</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={"All"}
            onChange={e => {
              handleFilterChange(0, "riskLevel", e);
            }}
          >
            <ToggleButton disabled={loading} value={"All"}>
              All
            </ToggleButton>
            <ToggleButton className="risk1" disabled={loading} value={1}>
              1
            </ToggleButton>
            <ToggleButton className="risk2" disabled={loading} value={2}>
              2
            </ToggleButton>
            <ToggleButton className="risk3" disabled={loading} value={3}>
              3
            </ToggleButton>
            <ToggleButton className="risk4" disabled={loading} value={4}>
              4
            </ToggleButton>
            <ToggleButton className="risk5" disabled={loading} value={5}>
              5
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <ButtonToolbar>
          <Form.Label>Year</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={"All"}
            onChange={e => {
              handleFilterChange(0, "year", e);
            }}
          >
            <ToggleButton disabled={loading} value={"All"}>
              All
            </ToggleButton>
            {[2017, 2018, 2019, 2020].map(year => {
              return (
                <ToggleButton key={year} disabled={loading} value={year}>
                  {year}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </ButtonToolbar>
        <Form.Group controlId="formGridState">
          <Form.Label>Month</Form.Label>
          <Form.Control
            as="select"
            disabled={loading}
            onChange={e => handleFilterChange(0, "month", e.target.value)}
          >
            <option value={"All"}>All Months...</option>
            {[
              { label: "Jan", val: 1 },
              { label: "Feb", val: 2 },
              { label: "Mar", val: 3 },
              { label: "Apr", val: 4 },
              { label: "May", val: 5 },
              { label: "Jun", val: 6 },
              { label: "Jul", val: 7 },
              { label: "Aug", val: 8 },
              { label: "Sep", val: 9 },
              { label: "Oct", val: 10 },
              { label: "Nov", val: 11 },
              { label: "Dec", val: 12 }
            ].map(month => {
              return (
                <option key={month.val} value={month.val}>
                  {month.label}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
      </div>
    );
  }
}
export default Controls;
