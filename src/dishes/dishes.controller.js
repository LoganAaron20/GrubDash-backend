const path = require("path");
const bodyDataHas = require("../utils/bodyDataHas");
const checkPrice = require("../utils/checkPrice");


// existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

//  function to assign ID's when necessary
const nextId = require("../utils/nextId");

// LIST METHOD
function list(req, res, next) {
  res.json({ data: dishes });
}

//CREATE METHOD
function createDish(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

//UPDATE METHOD
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  }
}

function dishIdIsValid(req, res, next) {
  const {
    data: { id },
  } = req.body;
  const { dishId } = req.params;
  if (dishId === id || !id) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Dish id is not valid: ${id}`,
    });
  }
}

function update(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  const { data: { name, description, image_url, price } = {} } = req.body;
  (foundDish.name = name),
    (foundDish.description = description),
    (foundDish.image_url = image_url),
    (foundDish.price = price);

  res.json({ data: foundDish });
}

//READ METHOD
function read(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  res.status(200).json({ data: foundDish });
}

// function bodyDataHas(propertyName) {
//   return function (req, res, next) {
//     const { data = {} } = req.body;
//     if (data[propertyName]) {
//       return next();
//     } else {
//       return next({
//         status: 400,
//         message: `Missing ${propertyName}`,
//       });
//     }
//   };
// }

// function checkPrice(req, res, next) {
//   const { data: { price } = {} } = req.body;
//   if (typeof price === "number" && price > 0) {
//     next();
//   } else {
//     return next({
//       status: 400,
//       message: "Dish must have a price greater than 0",
//     });
//   }
// }

module.exports = {
  list,
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("image_url"),
    checkPrice,
    createDish,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("image_url"),
    checkPrice,
    dishIdIsValid,
    update,
  ],
};
