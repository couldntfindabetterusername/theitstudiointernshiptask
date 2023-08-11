import mongoose from "mongoose";
import User from "./model.js";
import nodemailer from "nodemailer";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;
  try {
    const newUser = new User(user);
    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, hobbies } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with this id");

  const updatedUser = { name, phone, email, hobbies, _id: id };
  await User.findByIdAndUpdate(id, updatedUser, {
    new: true,
  });

  res.status(200).json(updatedUser);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with this id");

  await User.findByIdAndRemove(id);

  res.status(200).json({ message: "User deleted" });
};

export const sendEmail = async (req, res) => {
  const ids = req.body;

  ids.ids.map((id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No user with this id");
  });

  const users = await User.find({ _id: { $in: ids.ids } });

  let htmlContent = "";
  users.map((user) => {
    htmlContent += user.name + " ";
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
  //64d5f360405a1f07cf5bf98c,64d5f355405a1f07cf5bf98a
  const mailConfigurations = {
    from: process.env.USER_MAIL,
    to: process.env.CLIENT_MAIL,
    subject: "Sending Email using Node.js",
    text: htmlContent,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      return res.status(404).json({ message: error.message });
    }
    res.status(200).json({ message: "Email sent successfully" });
  });
};
