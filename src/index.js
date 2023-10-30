const fastify = require("fastify")({ logger: true });

const mongoose = require("mongoose");
require("dotenv").config();

const auth = require("./middlewares/auth");

// routes
const userRoutes = require("./routes/user.routes");

// middlewares
// fastify.addHook("preHandler", auth);

// connect to db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

// start server
fastify.register(userRoutes, { prefix: "/api/v1/users" });

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 9013);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (error) {
    console.log(error);
  }
};

start();
