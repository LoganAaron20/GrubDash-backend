const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotFound = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router.route("/").get(controller.list).post(controller.create);

router.route("/:dishId").get(controller.read).all(methodNotFound);

module.exports = router;
