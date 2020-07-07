const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Setup schema
var autofocusTagSchema = new Schema(
  {
    tag_name: String,
    tag_class: String,
    created_date: String,
    theatre: String,
    industry: String,
    samples: Number
  },
  { collection: "data_autofocus_tags" }
);
// Export Contact model
// const Entry = (module.exports = mongoose.model("data-slr", entrySchema));
// module.exports.get = function(callback, limit) {
//   Entry.find(callback).limit(limit);
// };
module.exports = mongoose.model(
  "data_autofocus_tags",
  autofocusTagSchema,
  "data_autofocus_tags"
);
