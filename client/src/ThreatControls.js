import React, { Component } from "react";
import {
  ButtonToolbar,
  Form,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import Select from "react-select";

class ThreatControls extends Component {
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
    const { handleFilterChange, loading, threatData, industries } = this.props;
    const options = industries.map(industry => {
      return { value: industry, label: industry };
    });
    return (
      <div className="threat-control">
        <Form.Group controlId="formGridState">
          <Form.Label>App Typess</Form.Label>
          <Form.Control
            as="select"
            disabled={loading}
            onChange={e => handleFilterChange(1, "tagClass", e.target.value)}
          >
            {threatData.map(threat => {
              return (
                <option key={threat.value} value={threat.value}>
                  {threat.name}
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
                    1,
                    "industry",
                    selectedIndustry.map(industry => industry.value)
                  );
                } else {
                  handleFilterChange(1, "industry", "All");
                }
              }}
            >
              Apply
            </button>
            <br />
            <Select
              isMulti
              className="multi-select"
              value={selectedIndustry}
              onChange={selectedIndustry => {
                this.setState({ selectedIndustry });
              }}
              options={options}
            />
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
          </div>
        </Form.Group>
        <ButtonToolbar>
          <Form.Label>Theater</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={"All"}
            onChange={e => {
              handleFilterChange(1, "theatre", e);
            }}
          >
            <ToggleButton disabled={loading} value={"All"}>
              All
            </ToggleButton>
            <ToggleButton className="NAM" disabled={loading} value={"NAM"}>
              NAM
            </ToggleButton>
            <ToggleButton className="EMEA" disabled={loading} value={"EMEA"}>
              EMEA
            </ToggleButton>
            <ToggleButton className="APAC" disabled={loading} value={"APAC"}>
              APAC
            </ToggleButton>
            <ToggleButton className="JP" disabled={loading} value={"JP"}>
              JP
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
              handleFilterChange(1, "year", e);
            }}
          >
            <ToggleButton disabled={loading} value={"All"}>
              All
            </ToggleButton>
            {[2018, 2019, 2020].map(year => {
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
            onChange={e => handleFilterChange(1, "month", e.target.value)}
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
export default ThreatControls;
