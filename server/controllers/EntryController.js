// Import Entry model
const Entry = require("./../models/EntryModel");

// Handle index actions
exports.index = function(req, res) {
  Entry.find({}, function(err, entries) {
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
  }).limit(25);
};

// Handle view contact info
exports.view = function(req, res) {
  Entry.findById(req.params._id, function(err, entries) {
    if (err) res.send(err);
    res.json({
      message: "Entry details loading..",
      data: entries
    });
  });
};

exports.industries = function(req, res) {
  const parseFilter = params => {
    const quarters = [
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 1, $lte: 3 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 4, $lte: 6 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 7, $lte: 9 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 10, $lte: 12 }
      }
    ];
    const filter = {};
    params.split(",").forEach(item => {
      const strArr = item.split(":");
      const key = strArr[0];
      const value = isNaN(strArr[1]) ? strArr[1] : Number(strArr[1]);
      if (key === "created_date") {
        filter["year"] = quarters[value - 1].year;
        filter["month"] = quarters[value - 1].month;
      } else {
        if (typeof value === String) {
          filter[key] = decodeURI(value);
        } else {
          filter[key] = value;
        }
      }
    });
    return filter;
  };
  const filterObj = req.query.filterBy ? parseFilter(req.query.filterBy) : {};
  Entry.distinct("industry", filterObj, function(err, industries) {
    res.json({
      message: "Industries retrieved successfully",
      data: industries
    });
  });
};

exports.aggregate = function(req, res) {
  const parseGroup = params => {
    const groupId = { app_name: "$app_name" };
    params.split(",").forEach(key => {
      groupId[key] = `$${key}`;
    });
    return groupId;
  };
  const parseFilter = params => {
    const quarters = [
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 1, $lte: 3 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 4, $lte: 6 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 7, $lte: 9 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 10, $lte: 12 }
      }
    ];
    const filter = {};
    params.split(",").forEach(item => {
      const strArr = item.split(":");
      const key = strArr[0];
      const value = isNaN(strArr[1]) ? strArr[1] : Number(strArr[1]);
      if (key === "created_date") {
        filter["year"] = quarters[value - 1].year;
        filter["month"] = quarters[value - 1].month;
      } else {
        if (typeof value === String) {
          filter[key] = decodeURI(value);
        } else {
          filter[key] = value;
        }
      }
    });
    return filter;
  };

  const sort = req.query.sortBy ? { [req.query.sortBy]: -1 } : { sessions: -1 };
  const groupId = req.query.groupBy
    ? parseGroup(req.query.groupBy)
    : { app_name: "$app_name" };
  const filterObj = req.query.filterBy ? parseFilter(req.query.filterBy) : {};
  console.log("------------------------------------");
  console.log("Applications API", filterObj);
  console.log("------------------------------------");
  Entry.aggregate([
    { $match: filterObj },
    {
      $group: {
        _id: groupId,
        sessions: { $sum: "$sessions" },
        bytes: { $sum: "$bytes" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: sort
    },
    { $limit: 25 }
  ])
    .then(function(entries) {
      res.json({
        status: "success",
        message: "Entries retrieved successfully",
        data: entries
      });
    })
    .catch(err => {
      res.json({
        status: "error",
        message: err
      });
    });
};

exports.aggregateByRiskLevel = function(req, res) {
  const parseGroup = params => {
    const groupId = { app_name: "$app_name" };
    params.split(",").forEach(key => {
      groupId[key] = `$${key}`;
    });
    return groupId;
  };
  const parseFilter = params => {
    const quarters = [
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 1, $lte: 3 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 4, $lte: 6 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 7, $lte: 9 }
      },
      {
        year: { $gte: 2019, $lt: 2020 },
        month: { $gte: 10, $lte: 12 }
      }
    ];
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

  const sort = req.query.sortBy ? { [req.query.sortBy]: -1 } : { sessions: -1 };
  const groupId = req.query.groupBy
    ? parseGroup(req.query.groupBy)
    : { app_name: "$app_name" };
  const filterObj = req.query.filterBy ? parseFilter(req.query.filterBy) : {};
  const groupObj = {
    app_name: "$app_name",
    risk_level: "$risk_level"
  };
  // if (filterObj.industry) {
  //   groupObj.industry = "$industry";
  // }
  console.log("------------------------------------");
  console.log("Applications API", filterObj);
  console.log("------------------------------------");
  Entry.aggregate([
    { $match: { risk_level: { $ne: null }, ...filterObj } },
    {
      $group: {
        _id: groupObj,
        sessions: { $sum: "$sessions" },
        bytes: { $sum: "$bytes" }
      }
    },
    { $sort: sort },
    { $limit: 1000 },
    {
      $group: {
        _id: { risk_level: "$_id.risk_level" },
        sessions: { $sum: "$sessions" },
        bytes: { $sum: "$bytes" },
        industries: { $addToSet: "$_id.industry" },
        children: {
          $push: {
            name: "$_id.app_name",
            risk_level: "$_id.risk_level",
            sessions: "$sessions",
            bytes: "$bytes"
          }
        }
      }
    }
  ])
    .then(function(entries) {
      res.json({
        status: "success",
        message: "Entries retrieved successfully",
        data: entries
      });
    })
    .catch(err => {
      res.json({
        status: "error",
        message: err
      });
    });
};
