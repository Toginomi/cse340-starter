// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process add classification form submission
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Management view 
router.get("/management", utilities.handleErrors(invController.buildManagement));

// Route to process add inventory form submission
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Route to trigger intentional error view
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;