import React, { Component } from "react";
import {
  ButtonToolbar,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Button
} from "react-bootstrap";
import Controls from "./Controls";
import ThreatControls from "./ThreatControls";
import filter from "./img/filter.svg";
import close from "./img/close.svg";
import print from "./img/print.svg";

const { innerWidth: width } = window;
const filterState = width < 1025 ? "control-close" : "control-open";

class ControlWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterState: filterState
    };
  }

  render() {
    const { handleFilterChange, dataSource, isLoading } = this.props;

    const { filterState } = this.state;
    const controlWrapper = "control-wrapper " + filterState;
    return (
      <div className="treemap-controls">
        {/* <ControlWrapper
          handleRefreshQuery={this.handleRefreshQuery}
          handleFilterChange={this.handleFilterChange}
          isLoading={isLoading}
          industries={industries}
        /> */}
        <div className="hide-show-btn-container">
          <div id="toggle" className="on" onClick={this.renderHideShowBtn}>
            <img
              src={filterState === "control-open" ? close : filter}
              alt="filter"
            ></img>
            <span>{filterState === "control-open" ? "Close" : "Filters"}</span>
          </div>
        </div>
        <div className={controlWrapper}>
          <div>
            {/* <div className="aside"><h3>FILTERS</h3></div> */}
            <ButtonToolbar>
              <Form.Label>Category</Form.Label>
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={0}
                onChange={e => {
                  handleFilterChange(e, "dataSource", e);
                }}
              >
                {[
                  { label: "Applications", val: 0 },
                  { label: "Threats", val: 1 }
                ].map(app => {
                  return (
                    <ToggleButton
                      key={app.val}
                      disabled={isLoading}
                      value={app.val}
                    >
                      {app.label}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </ButtonToolbar>
            {this.renderControls(dataSource)}
            {/* <Button
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                window.print();
              }}
            >
              <img src={print} alt="print"></img>
            </Button> */}
          </div>
        </div>
      </div>
    );
  }

  renderHideShowBtn = event => {
    const { filterState } = this.state;
    event.stopPropagation();
    const button = event.currentTarget;
    if (filterState === "control-open") {
      button.classList.remove("on");
      this.setState({ filterState: "control-close" });
    } else {
      button.classList.add("on");
      this.setState({ filterState: "control-open" });
    }
  };

  renderControls = source => {
    const {
      handleRefreshQuery,
      handleFilterChange,
      isLoading,
      industries,
      threatCategories
    } = this.props;
    return source === 0 ? (
      <Controls
        handleClick={handleRefreshQuery}
        handleFilterChange={handleFilterChange}
        loading={isLoading}
        industries={industries}
      />
    ) : (
      <ThreatControls
        handleClick={handleRefreshQuery}
        handleFilterChange={handleFilterChange}
        threatData={threatCategories}
        loading={isLoading}
        industries={industries}
      />
    );
  };
}
export default ControlWrapper;
