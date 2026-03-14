import UserMdl from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
// signup controllers
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // check by username

    const checkUserByUserName = await UserMdl.findOne({ userName });
    if (checkUserByUserName) {
      return res.status(400).json({ message: "userName already exist" });
    }

    // check by email

    const checkUserByemail = await UserMdl.findOne({ email });
    if (checkUserByemail) {
      return res.status(400).json({ message: "email already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 digit" });
    }

    // password hashedPassword

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user

    const user = await UserMdl.create({
      userName,
      email,
      password: hashedPassword,
    });

    // gen token

    const token = await genToken(user._id);

    // store token in cookie

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 100 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
};

// login controllers
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check by email

    const user = await UserMdl.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    // gen token

    const token = await genToken(user._id);

    // store token in cookie

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 100 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` });
  }
};

// logout controllers

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout" });
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` });
  }
};
