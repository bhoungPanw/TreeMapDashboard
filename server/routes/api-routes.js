// Filename: api-routes.js
// Initialize express router
const router = require("express").Router();
const entryController = require("./../controllers/EntryController");
const autoFocusController = require("./../controllers/AutoFocusController");

// Set default API response
router.get("/", function(req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub crafted with love!"
  });
});

// Entry routes
router.route("/applications").get(entryController.aggregate);
router.route("/applicationsgroups").get(entryController.aggregateByRiskLevel);
router.route("/applications/industries").get(entryController.industries);

//Autofocus routes
router.route("/threats").get(autoFocusController.aggregate);
router.route("/threats/industries").get(entryController.industries);

// router
//   .route("/threats/malware-campaigns")
//   .get(autoFocusController.aggregateCampaigns);
// router.route("/threats/tag-groups").get(autoFocusController.aggregateTagGroups);
// router
//   .route("/threats/malicious-behavior")
//   .get(autoFocusController.aggregateMaliciousBehavior);

// Export API ro

// Export API routes
module.exports = router;
