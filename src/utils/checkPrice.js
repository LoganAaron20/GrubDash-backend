function checkPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (typeof price === "number" && price > 0) {
    next();
  } else {
    return next({
      status: 400,
      message: "Dish must have a price greater than 0",
    });
  }
}

module.exports = checkPrice;
