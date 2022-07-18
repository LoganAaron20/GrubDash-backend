const path = require("path");
const { PassThrough } = require("stream");
const bodyDataHas = require("../utils/bodyDataHas");



//  existing order data
const orders = require(path.resolve("src/data/orders-data"));

//  function to assigh ID's when necessary
const nextId = require("../utils/nextId");



//LIST METHOD
function list(req, res, next) {
  res.json({ data: orders });
}

function read(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.json({ data: foundOrder });
  } else {
    next();
  }
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (!foundOrder) {
    next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    });
  } else {
    next();
  }
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.findIndex((order) => order.id === Number(orderId));
  if (foundOrder) {
    orders.splice(foundOrder, 1);
    res.sendStatus(204);
  }
}

function isOrderPending(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder.status !== "pending") {
    return next({
      status: 400,
      message: "Order is not pending",
    });
  } else {
    next();
  }
}


function dishesAndQuantityAreValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  }

  for (let index = 0; index < dishes.length; index++) {
    if (
      !dishes[index]["quantity"] ||
      Number.isNaN(dishes[index]["quantity"]) ||
      !Number.isInteger(dishes[index]["quantity"])
    ) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function orderIdIsValid(req, res, next) {
  const {
    data: { id },
  } = req.body;
  const { orderId } = req.params;
  if (orderId === id || !id) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Order id is not valid: ${id}`,
    });
  }
}

function validateStatus(req, res, next) {
  const {
    data: { status },
  } = req.body;
  const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (!status || status == "" || !validStatus.includes(status)) {
    return next({
      status: 400,
      message: `status is not valid`,
    });
  } else {
    return next();
  }
}

function update(req, res) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.status = status;
  foundOrder.dishes = dishes;

  res.json({ data: foundOrder });
}

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesAndQuantityAreValid,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    orderIdIsValid,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesAndQuantityAreValid,
    validateStatus,
    update,
  ],
  delete: [orderExists, isOrderPending, destroy],
};
