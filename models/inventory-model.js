const pool = require("../database/")

/* ******************
 * Get all classification data
  * ***************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name ASC")   
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a single inventory item by inventory ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`,
      [classification_name]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
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
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}




module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory
};