const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
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

/* ***************************
  * Build management view
  * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null, // Fixed: Added errors to prevent crash
  })
}

/* ***************************
  * Build add classification view
  * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null, // Fixed: Added errors to prevent crash
  })
}

/* ***************************
  * Build add inventory view
  * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  // Task 3: Dropdown must be pre-built in utilities
  const classificationSelect = await utilities.buildClassificationList() 
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect, // Fixed: Using the HTML string from utility
    errors: null, // Fixed: Added errors to prevent crash
  })
}

/* ***************************
  * Trigger intentional error view
  * ************************** */
invCont.triggerError = function (req, res, next) {
  const err = new Error("This is an intentional error for testing purposes!");
  err.status = 500;
  next(err);
};

/* ***************************
  * Add classification (Processing)
  * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    
    if (result) {
      let nav = await utilities.getNav() // Rebuild nav to show new category
      req.flash("notice", `The ${classification_name} classification was successfully added.`)
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the insertion failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav: await utilities.getNav(),
        errors: null,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
  * Add inventory (Processing)
  * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const { 
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id 
    } = req.body
    
    const result = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    )

    if (result) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
      res.redirect("/inv/management") // Task 3: Success displays management view
    } else {
      req.flash("notice", "Failed to add inventory.")
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav: await utilities.getNav(),
        classificationSelect,
        errors: null,
        inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont;