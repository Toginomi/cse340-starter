const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Build account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Deliver Update View
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))

// Process Account Info Update
router.post(
  "/update-info",
  // Add your server-side validation here (e.g. accountValidate.updateRules())
  utilities.handleErrors(accountController.updateAccount)
)

// Process Password Update
router.post(
  "/update-password",
  // Add your server-side validation here
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
