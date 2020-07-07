import React, { Component } from "react";
import { ButtonToolbar } from "react-bootstrap";

class TopList extends Component {
  constructor(props) {
    super(props);
  }

  buildData = (data, query) => {
    let arr = [];
    data.forEach(item => {
      if (item.children) {
        arr.push(...item.children);
      }
    });
    return arr
      .sort((a, b) =>
        a[query.sortBy] > b[query.sortBy]
          ? -1
          : b[query.sortBy] > a[query.sortBy]
          ? 1
          : 0
      )
      .slice(0, 24);
  };

  render() {
    const { data, query, dataSource } = this.props;
    const listData = this.buildData(data, query);
    const topLabel =
      dataSource === 0
        ? "Applications by " +
          query.sortBy.charAt(0).toUpperCase() +
          query.sortBy.slice(1)
        : "Threats by " +
          query.sortBy.charAt(0).toUpperCase() +
          query.sortBy.slice(1);
    if (listData) {
      return (
        <div className="top-list">
          <div className="list-wrapper">
            <span className="label">Top {topLabel}</span>
            <ul>
              {listData.map((item, idx) => {
                const truncatedStr =
                  item.name.length > 15
                    ? item.name.slice(0, 15) + "..."
                    : item.name;
                const classType =
                  dataSource === 0 ? "risk" + item.risk_level : item.theatre;
                return (
                  <li key={item.name + idx} className={classType}>
                    {truncatedStr}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default TopList;
