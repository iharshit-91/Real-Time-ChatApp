import mongoose from "mongoose";
// for connect database
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("db connect");
  } catch (error) {
    console.log("db error");
  }
};

export default connectDb;
