// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");

// --- PUBLIC ROUTES ---
// These remain open so anyone can see the cars.

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));


// --- PROTECTED ADMINISTRATIVE ROUTES ---

// Inventory management view 
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
);

// Route to build add classification view
router.get("/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process add classification form submission
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to process add inventory form submission
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to return inventory by classification as JSON for AJAX
router.get(
  "/getInventory/:classification_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Deliver Edit Inventory View
router.get(
  "/edit/:inv_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

// Process Inventory Update Request
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delivery of Delete Confirmation view
router.get(
  "/delete/:inv_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteView)
)

// Process the deletion
router.post(
  "/delete", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteItem)
)

// Public test route
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;