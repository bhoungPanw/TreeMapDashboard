const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Setup schema
var entrySchema = new Schema(
  {
    app_name: String,
    subcategory: String,
    theatre: String,
    industry: String,
    risk_level: Number,
    is_saas_based: Number,
    bytes: Number,
    sessions: Number,
    slr_reports: Number,
    created_date: Date
  },
  { collection: "data_slr" }
);
// Export Contact model
// const Entry = (module.exports = mongoose.model("data-slr", entrySchema));
// module.exports.get = function(callback, limit) {
//   Entry.find(callback).limit(limit);
// };
module.exports = mongoose.model("data_slr", entrySchema, "data_slr");
