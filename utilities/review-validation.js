const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const validate = {}

/* **********************************
 * Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Please provide a review of at least 5 characters."),
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryById(inv_id)
    const reviews = await reviewModel.getReviewsByInvId(inv_id)
    const title = `${data.inv_make} ${data.inv_model}`
    
    res.render("inventory/detail", {
      title,
      nav,
      vehicle: data,
      reviews,
      errors, // This passes the errors back to the view
      review_text,
    })
    return
  }
  next()
}

module.exports = validate