const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: req.flash("notice")
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const result = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password)

    if (result.rows && result.rows.length > 0) {
      req.flash("notice", "Congratulations, your account has been created. Please log in.")
      res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, registration failed. Please try again.")
      res.redirect("/account/register")
    }
  } catch (error) {
    console.error("Registration error:", error)
    next(error)
  }
}


module.exports = { buildLogin, buildRegister , registerAccount }
