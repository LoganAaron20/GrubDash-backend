const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotFound = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotFound);

router.route("/").get(controller.list).post(controller.create);
module.exports = router;
