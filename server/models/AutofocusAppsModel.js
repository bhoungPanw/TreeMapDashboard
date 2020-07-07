const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Setup schema
var autofocusApps = new Schema(
  {
    app_name: String,
    created_date: String,
    theatre: String,
    industry: String,
    samples: Number
  },
  { collection: "data_autofocus_apps" }
);

module.exports = mongoose.model(
  "data_autofocus_apps",
  autofocusApps,
  "data_autofocus_apps"
);
