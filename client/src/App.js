import React from "react";
import logo from "./img/logo.svg";
import "./App.scss";
import ApplicationsTreeMap from "./ApplicationsTreeMap";

const App = () => (
  <div className="App">
    <nav className="navbar">
      <a className="navbar-brand" href="https://unit42.paloaltonetworks.com/">
        <img className="logo" src={logo} alt="Logo" />
      </a>
    </nav>
    <div className="">
      <div className="description">
        Unit 42 aggregated data from{" "}
        <a
          target="_new"
          href="https://www.paloaltonetworks.com/cortex/autofocus?utm_medium=content-syndication&utm_source=Data_Viz_SLR"
        >
          AutoFocus
        </a>
        , the Palo Alto Networks threat intelligence service, and the
        <br />
        <a
          target="_new"
          href="https://start.paloaltonetworks.com/security-lifecycle-review-risk-assessment.html?utm_medium=content-syndication&utm_source=Data_Viz_SLR"
        >
          Security Lifecycle Review (SLR)
        </a>
        , a cloud-based application that summarizes risks within an
        organization, into a live-feed visualization tool that highlights top
        application usage and threat trends.
      </div>
      <div>
        <ApplicationsTreeMap />
      </div>
      <div className="aside">{/* <h3>VIZUALIZATION</h3> */}</div>
    </div>
    <footer className="footer">
      © 2020 Palo Alto Networks, Inc. All rights reserved.
    </footer>
  </div>
);

export default App;
