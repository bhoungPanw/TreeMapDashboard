const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Setup schema
var autofocusFileTypeSchema = new Schema(
  {
    filetype: String,
    tag_class: String,
    created_date: String,
    theatre: String,
    industry: String,
    samples: Number
  },
  { collection: "data_autofocus_filetypes" }
);
// Export Contact model
// const Entry = (module.exports = mongoose.model("data-slr", entrySchema));
// module.exports.get = function(callback, limit) {
//   Entry.find(callback).limit(limit);
// };
module.exports = mongoose.model(
  "data_autofocus_filetypes",
  autofocusFileTypeSchema,
  "data_autofocus_filetypes"
);
