const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      skill,
      description,
    } = req.body;
    // validation
    validateSignupData(req);

    // encrypt the password (using bcrypt)
    const hashPassword = await bcrypt.hash(password, 10);

    // creating a new instance of the user Model
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      skill,
      description,
      password: hashPassword,
    }); // creating a new data with userObj

    await user.save(); // this will save the data to the database // a promise
    res.send("user added successfully");
  } catch (error) {
    res.status(500).send("error occured : " + error.message);
  }
  // In the database there are two other fields (__v, _id) -> these are created by mongodb
  // _id -> unique id
});

//login
authRouter.patch("/edit", userAuth, async (req, res) => {
  const userId = req.user._id;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photo",
    "description",
    "gender",
    "age",
    "skill",
  ];

  try {
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).send(`Something went wrong: ${err.message}`);
  }
});

//logout
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

module.exports = authRouter;
