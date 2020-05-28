const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require ('pg')
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
//  let user;
 // for (const userId in users) {
 //   user = users[userId];
  //  if (user.email.toLowerCase() === email.toLowerCase()) {
  //    break;
  //  } else {
 //     user = null;
 //   }
//  }
//  return Promise.resolve(user);
return pool.query(`
SELECT * 
FROM users 
WHERE users.email = $1`, [email])
.then (res => res.rows[0])
.catch (error => console.log(error))
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //return Promise.resolve(users[id]);
  return pool.query(`
SELECT * 
FROM users 
WHERE users.id = $1`, [id])
.then (res => res.rows[0])
.catch (error => console.log(error))
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
 // const userId = Object.keys(users).length + 1;
 // user.id = userId;
  //users[userId] = user;
 // return Promise.resolve(user);
//}
return pool.query(`
INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING *`, [user.name, user.email, user.password])
.then (res => res.rows[0])
.catch (err => console.log(err))
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  //return getAllProperties(null, 2);
  return pool.query(`
  SELECT properties.*, reservations.*, AVG(property_reviews.rating) as average_rating
FROM property_reviews
JOIN users ON guest_id = users.id
JOIN properties ON property_id = properties.id
JOIN reservations ON reservation_id = reservations.id
WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date LIMIT $2`, [guest_id, limit])
.then(res => res.rows)

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  
  let queryString = `SELECT  properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let amount = Object.keys(options)
  if (options.city) {
    let addWord = ""
    if (amount[0] === 'city') {
        addWord = "WHERE"
     }
     else if (amount.length >= 2) {
       addWord = "AND"
     }
    queryParams.push(`%${options.city}%`);
    queryString += `${addWord} city LIKE $${queryParams.length} `;
}
if (options.owner_id) {
  let addWord = ""
  if (amount[0] === 'owner_id') {
     addWord = "WHERE"
  }
  else if (amount.length >= 2) {
    addWord = "AND"
  }
  queryParams.push(`${options.owner_id}`);
  queryString += `${addWord} properties.owner_id = $${queryParams.length} `;
}
if (options.minimum_price_per_night || options.maximum_price_per_night) {
  let addWord = ""
  if (amount[0] === 'minimum_price_per_night' || amount[0] === 'maximum_price_per_night') {
     addWord = "WHERE"
  }
  else if (amount.length >= 2) {
    addWord = "AND"
  }
  queryParams.push(Number(options.minimum_price_per_night) * 100);
  queryParams.push(Number(options.maximum_price_per_night) * 100);
  queryString += `${addWord} properties.cost_per_night <= $${queryParams.length} AND properties.cost_per_night >= $${queryParams.length-1} `;
}
if (options.minimum_rating) {
  let addWord = ""
  if (amount[0] === 'minimum_rating') {
     addWord = "WHERE"
  }
  else if (amount.length >= 2) {
    addWord = "AND"
  }
  else addWord = "WHERE";
  queryParams.push(`${options.minimum_rating}`);
  queryString += `${addWord} property_reviews.rating >= $${queryParams.length} `;
}

queryParams.push(limit);
queryString += `
GROUP BY properties.id
ORDER BY cost_per_night 
LIMIT $${queryParams.length};`;

console.log(queryString, queryParams)

return pool.query(queryString, queryParams)
.then(res => res.rows);
}

exports.getAllProperties = getAllProperties


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
 // const propertyId = Object.keys(properties).length + 1;
  //property.id = propertyId;
 // properties[propertyId] = property;
  //return Promise.resolve(property);
//}
return pool.query (`
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
  RETURNING *`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then (res => res.rows);
}
exports.addProperty = addProperty;
