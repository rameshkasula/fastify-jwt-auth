const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getAllUsers(request, reply) {
  try {
    const users = await User.find({});

    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function getUserById(request, reply) {
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      reply.status(404).send("user not found");
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function createUser(request, reply) {
  try {
    const user = new User(request.body);
    console.log("user", user);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await user.save();
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function login(request, reply) {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      reply.status(404).send("user not found");
    }
    const isPasswordValid = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!isPasswordValid) {
      reply.status(401).send("invalid password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user["token"] = token;
    const { password, ...rest } = user._doc;

    reply.send({
      user: rest,
      token: token,
    });
  } catch (error) {
    reply.status(500).send(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  login,
};
