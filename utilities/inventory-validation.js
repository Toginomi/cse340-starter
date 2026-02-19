const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a make."),
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."),
    body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
        .withMessage("Please provide a valid year."),
    body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide a description of at least 10 characters."),
    body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide an image path."),
    body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."),
    body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."),
    body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide valid miles."),
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a color."),
    body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
            inv_image: req.body.inv_image, // Added these for stickiness
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    } else {
        next()
    }
}

/* ******************************
 * Check update data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate;