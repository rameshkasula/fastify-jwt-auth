const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function auth(request, reply, next) {
  const apiKey = request.headers["x-api-key"];
  const Authorization = request.headers["authorization"];
  console.log(
    "apiKey",
    apiKey,
    "Authorization",
    Authorization,
    "iiiii",
    apiKey === process.env.API_KEY
  );
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return reply.status(401).send("Unauthorized");
  }
  if (!Authorization) {
    return reply.status(401).send("Unauthorized");
  }
  const token = Authorization.split(" ")[1];
  if (!token) {
    return reply.status(401).send("Unauthorized");
  }
  const verified = await jwt.verify(token, process.env.JWT_SECRET);
  const currentTime = Math.floor(Date.now() / 1000);

  if (verified.iat > currentTime) {
    console.log("Token used before it was issued");
    reply.status(401).send("Token has Unauthorized");
  } else if (decoded.exp < currentTime) {
    console.log("Token has expired");
    reply.status(401).send("Token has Unauthorized");
  }

  if (!verified) {
    return reply.status(401).send("Unauthorized");
  }
  const user = await User.findById(verified.userId);
  if (!user) {
    return reply.status(401).send("Unauthorized");
  }

  request.user = user;
  await next();
}

module.exports = auth;
