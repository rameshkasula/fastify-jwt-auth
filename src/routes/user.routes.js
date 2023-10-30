const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
async function routes(fastify, options) {
  fastify.get("/", { preHandler: auth }, userController.getAllUsers);

  fastify.get("/:id", userController.getUserById);

  fastify.post("/register", userController.createUser);

  fastify.post("/login", userController.login);
}

module.exports = routes;
