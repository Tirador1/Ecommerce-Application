import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../../DB/models/user.model.js";
import sendEmail from "../../services/sendEmail.service.js";

export const signUp = async (req, res, next) => {
  const { username, email, password, phoneNumbers, addresses, age } = req.body;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next({
      cause: 409,
      message: "User already exists",
    });
  }

  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const isEmailSent = await sendEmail({
    to: email,
    subject: "no-reply email verification Ecommerce App",
    message: `<h1>Click on the link below to verify your email</h1>
    <a href="http://localhost:3000/auth/verify-email/${emailToken}">Verify Email</a>
    `,
  });

  if (!isEmailSent) {
    return next({
      cause: 500,
      message:
        "Internal server error while sending email verification link. Please try again later.",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumbers,
    addresses,
    role: "user",
    age,
  });

  res.status(201).json({
    message: "User created successfully. Please verify your email",
    User: newUser,
  });
};

export const verifyEmail = async (req, res, next) => {
  const { emailToken } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(emailToken, process.env.JWT_SECRET);
  } catch (error) {
    return next({
      cause: 400,
      message: "Invalid or expired email verification link",
    });
  }

  const user = await User.findOneAndUpdate(
    { email: decoded.email, isEmailVerified: false },
    { isEmailVerified: true },
    { new: true }
  );

  if (!user) {
    return next({
      cause: 404,
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "Email verified successfully",
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { loggedIn: true },
    { new: true }
  );
  if (!user) {
    return next({
      cause: 401,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return next({
      cause: 401,
      message: "Invalid email or password",
    });
  }

  if (!user.isEmailVerified) {
    return next({
      cause: 403,
      message: "Email not verified",
    });
  }

  const token = jwt.sign(
    { email, id: user._id, loggedIn: true },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({
    message: "Login successful",
    token,
  });
};
