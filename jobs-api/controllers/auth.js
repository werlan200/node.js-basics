const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const newUser = await UserModel.create({ ...req.body });
  const token = newUser.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: newUser.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Provide email or password");
  }

  const user = await UserModel.findOne({ email });
  const isPasswordMatch = await user.comparePassword(password);

  if (!user || !isPasswordMatch) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
