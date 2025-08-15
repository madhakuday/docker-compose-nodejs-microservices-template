const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/responseHandler");
const User = require("../user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      return sendErrorResponse(res, "User already exists.");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userBody = new User({
      name,
      email,
      password: hashPassword,
    });

    await userBody.save();
    sendSuccessResponse(
      res,
      {
        name,
        email,
      },
      "User created",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch users", 400);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return sendErrorResponse(res, "Pass does not match.", 404);
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.WEB_TOKEN_SECRET
    );

    return sendSuccessResponse(
      res,
      {
        token,
      },
      "User successfully login",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch users", 400);
  }
};

exports.checkUserExists = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return sendErrorResponse(res, "userId is required", 400);
    }
    const user = await User.findById(userId);

    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    return sendSuccessResponse(
      res,
      { exists: true, userId: user._id },
      "User exists",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to check user", 400);
  }
};
