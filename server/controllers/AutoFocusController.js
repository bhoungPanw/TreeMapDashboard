// Import Autofocus model
const autofocusFileTypeSchema = require("../models/AutofocusFileTypesModel");
const autofocusTagSchema = require("../models/AutofocusTagsModel");
const autofocusTagGroupSchema = require("../models/AutofocusTagGroupModel");
const autofocusApps = require("../models/AutofocusAppsModel");

// Handle index actions
// exports.index = function(req, res) {
//   Entry.find({}, function(err, entries) {
//     if (err) {
//       res.json({
//         status: "error",
//         message: err
//       });
//     }
//     res.json({
//       status: "success",
//       message: "Entries retrieved successfully",
//       data: entries
//     });
//   }).limit(25);
// };

// // Handle view contact info
// exports.view = function(req, res) {
//   Entry.findById(req.params._id, function(err, entries) {
//     if (err) res.send(err);
//     res.json({
//       message: "Entry details loading..",
//       data: entries
//     });
//   });
// };

exports.industries = function(req, res) {
  autofocusTagSchema.distinct("industry", function(err, industries) {
    res.json({
      message: "Industries retrieved successfully",
      data: industries
    });
  });
};

exports.aggregate = function(req, res) {
  const parseFilter = params => {
    const filter = {};
    const lookup = {};
    params.split(",").forEach(item => {
      const strArr = item.split(":");
      const key = strArr[0];
      const value = isNaN(strArr[1]) ? strArr[1] : Number(strArr[1]);
      if (key === "created_date") {
        filter["year"] = quarters[value - 1].year;
        filter["month"] = quarters[value - 1].month;
      } else {
        if (lookup[key] && !Array.isArray(lookup[key])) {
          let newArr = [lookup[key]];
          newArr.push(value);
          lookup[key] = newArr;
          filter[key] = { $in: newArr };
        } else if (lookup[key] && Array.isArray(lookup[key])) {
          let newArr = lookup[key];
          newArr.push(value);
          lookup[key] = newArr;
          filter[key] = { $in: newArr };
        } else {
          lookup[key] = value;
          if (typeof value === String) {
            filter[key] = decodeURI(value);
          } else {
            filter[key] = value;
          }
        }
      }
    });
    return filter;
  };
  const filterObj = req.query.filterBy ? parseFilter(req.query.filterBy) : {};
  const groupObj = {
    tag_name: "$tag_name",
    theatre: "$threatre"
  };
  // if (filterObj.industry) {
  //   groupObj.industry = "$industry";
  // }
  console.log("------------------------------------");
  console.log("Autofocus API", filterObj);
  console.log("------------------------------------");
  if (filterObj && filterObj.tag_class === "tag_group") {
    delete filterObj.tag_class;
    autofocusTagGroupSchema.aggregate(
      [
        { $match: filterObj },
        {
          $group: {
            _id: groupObj,
            samples: { $sum: "$samples" }
          }
        },
        { $sort: { samples: -1 } },
        { $limit: 1000 },
        {
          $group: {
            _id: { theatre: "$_id.theatre" },
            samples: { $sum: "$samples" },
            industries: { $addToSet: "$_id.industry" },
            children: {
              $push: {
                name: "$_id.tag_name",
                theatre: "$_id.theatre",
                samples: "$samples",
                value: ["$samples"]
              }
            }
          }
        }
      ],
      function(err, entries) {
        if (err) {
          res.json({
            status: "error",
            message: err
          });
        }
        res.json({
          status: "success",
          message: "Entries retrieved successfully",
          data: entries
        });
      }
    );
  } else if (filterObj && filterObj.tag_class === "filetype") {
    delete filterObj.tag_class;
    autofocusFileTypeSchema.aggregate(
      [
        { $match: filterObj },
        {
          $group: {
            _id: {
              filetype: "$filetype",
              theatre: "$threatre",
              industry: "$industry"
            },
            samples: { $sum: "$samples" }
          }
        },
        { $sort: { samples: -1 } },
        { $limit: 1000 },
        {
          $group: {
            _id: { theatre: "$_id.theatre" },
            samples: { $sum: "$samples" },
            industries: { $addToSet: "$_id.industry" },
            children: {
              $push: {
                name: "$_id.filetype",
                theatre: "$_id.theatre",
                samples: "$samples",
                value: ["$samples"]
              }
            }
          }
        }
      ],
      function(err, entries) {
        if (err) {
          res.json({
            status: "error",
            message: err
          });
        }
        res.json({
          status: "success",
          message: "Entries retrieved successfully",
          data: entries
        });
      }
    );
  } else if (filterObj && filterObj.tag_class === "app") {
    delete filterObj.tag_class;
    autofocusApps.aggregate(
      [
        { $match: filterObj },
        {
          $group: {
            _id: {
              app_name: "$app_name",
              theatre: "$threatre",
              industry: "$industry"
            },
            sessions: { $sum: "$sessions" }
          }
        },
        { $sort: { sessions: -1 } },
        {
          $group: {
            _id: { theatre: "$_id.theatre" },
            sessions: { $sum: "$sessions" },
            industries: { $addToSet: "$_id.industry" },
            children: {
              $push: {
                name: "$_id.app_name",
                theatre: "$_id.theatre",
                sessions: "$sessions",
                value: ["$sessions"]
              }
            }
          }
        }
      ],
      function(err, entries) {
        if (err) {
          res.json({
            status: "error",
            message: err
          });
        }
        res.json({
          status: "success",
          message: "Entries retrieved successfully",
          data: entries
        });
      }
    );
  } else {
    autofocusTagSchema.aggregate(
      [
        { $match: filterObj },
        {
          $group: {
            _id: {
              tag_name: "$tag_name",
              theatre: "$theatre",
              industry: "$industry"
            },
            samples: { $sum: "$samples" },
            sessions: { $sum: "$sessions" }
          }
        },
        { $sort: { samples: -1 } },
        { $limit: 1000 },
        {
          $group: {
            _id: { theatre: "$_id.theatre" },
            samples: { $sum: "$samples" },
            sessions: { $sum: "$sessions" },
            industries: { $addToSet: "$_id.industry" },
            children: {
              $push: {
                name: "$_id.tag_name",
                theatre: "$_id.theatre",
                samples: "$samples",
                sessions: "$sessions",
                value: ["$samples"]
              }
            }
          }
        }
      ],
      function(err, entries) {
        if (err) {
          res.json({
            status: "error",
            message: err
          });
        }
        res.json({
          status: "success",
          message: "Entries retrieved successfully",
          data: entries
        });
      }
    );
  }
};
