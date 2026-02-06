// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));

// Route to trigger intentional error view
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;