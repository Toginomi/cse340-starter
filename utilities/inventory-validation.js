const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invCont = {}

/*  **********************************
    *  Inventory Data Validation Rules
    * ********************************* */
invCont.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a make."), // on error this message is sent.
    // model is required and must be string
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."), // on error this message is sent.
    // year is required and must be a valid year
    body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
        .withMessage("Please provide a valid year."), // on error this message is sent.
    // description is required and must be string
    body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide a description of at least 10 characters."), // on error this message is sent.
    // Image path is required
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path."),
    // Thumbnail path is required
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),
    // price is required and must be a valid number
    body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."), // on error this message is sent.
    // miles is required and must be a valid number
    body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide valid miles."), // on error this message is sent.
    // color is required and must be string
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a color."), // on error this message is sent.
    // classification is required and must be a valid classification id
    body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please select a classification."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
invCont.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,            
            classificationSelect,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    } else {
        next()
    }
}

module.exports = invCont;