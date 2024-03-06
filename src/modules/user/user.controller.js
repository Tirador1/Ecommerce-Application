import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../../DB/models/user.model.js";
import sendEmail from "../../services/sendEmail.service.js";

export const updateUserProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { username, phoneNumbers, addresses, age, role } = req.body;

  const isUsernameExist = await User.findOne({
    username,
    _id: { $ne: _id },
  });
  if (isUsernameExist) {
    return next({ cause: 409, message: "Username is already exist" });
  }

  const updatedUser = await User.findById(
    _id,
    "username email phoneNumbers addresses age role"
  );

  if (username) updatedUser.username = username;
  if (phoneNumbers) updatedUser.phoneNumbers = phoneNumbers;
  if (addresses) updatedUser.addresses = addresses;
  if (age) updatedUser.age = age;
  if (role) updatedUser.role = role;

  await updatedUser.save();

  res.status(200).json({
    message: "User updated successfully",
    User: updatedUser,
  });
};

export const updateEmail = async (req, res, next) => {
  const { _id } = req.user;
  const { email } = req.body;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next({ cause: 409, message: "Email is already exist" });
  }

  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
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

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { email, isEmailVerified: false },
    { new: true }
  );

  res.status(200).json({
    message: "Email updated successfully. Please verify your email",
    User: updatedUser,
  });
};

export const updatePassword = async (req, res, next) => {
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(_id);
  const isPasswordMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isPasswordMatch) {
    return next({ cause: 401, message: "Old password is incorrect" });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

  const updatedPasswordUser = await User.findByIdAndUpdate(
    _id,
    { password: hashedPassword },
    { new: true }
  );

  res.status(200).json({
    message: "Password updated successfully",
    User: updatedPasswordUser,
  });
};

export const deleteUser = async (req, res, next) => {
  const { _id } = req.user;
  const { password } = req.body;

  const user = await User.findById(_id);
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    return next({ cause: 401, message: "Password is incorrect" });
  }

  await User.findByIdAndUpdate(_id, { isDeleted: true });

  res.status(200).json({ message: "User deleted successfully" });
};

export const getUserProfile = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id, "-password");

  res.status(200).json({ message: "User profile data", user });
};
