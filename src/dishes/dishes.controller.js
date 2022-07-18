const path = require("path");

// COMPLETED: read method, list method, delete method
//IN PROGRESS: create method(creates a new dish and assigns id)
//UP NEXT: update method

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next) {
  res.json({ data: dishes });
}

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

function read(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  res.status(200).json({ data: foundDish });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    } else {
      return next({
        status: 400,
        message: `Missing ${propertyName}`,
      });
    }
  };
}

function checkPrice(req, res, next) {
  const { data: price } = req.body;
  if (Number(price) && Number(price) > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Invalid price",
    });
  }
}

function createDish(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

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
};
