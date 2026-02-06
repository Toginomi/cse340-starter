const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  try {
    const detailId = req.params.detailId;
    const data = await invModel.getInventoryById(detailId);
    if (!data) {
      throw new Error("Vehicle not found");
    }
    const nav = await utilities.getNav();
    const title = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title,
      nav,
      vehicle: data,
    });
  } catch (error) {
    next(error);
  }
};

invCont.triggerError = function (req, res, next) {
  const err = new Error("This is an intentional error for testing purposes!");
  err.status = 500;
  next(err);
};

module.exports = invCont;