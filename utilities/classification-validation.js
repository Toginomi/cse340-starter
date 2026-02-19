const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const invCont = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
invCont.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z0-9]+$/) // Task 2: No spaces or special characters
        .withMessage("Classification name cannot contain spaces or special characters."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
invCont.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
    } else {
        next()
    }
}

module.exports = invCont;