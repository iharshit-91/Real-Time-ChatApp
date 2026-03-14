// generate token

import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SEC, {
      expiresIn: "100d",
    });
    return token;
  } catch (error) {
    console.log("gen token error");
  }
};

export default genToken;
