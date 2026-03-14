import mongoose from "mongoose";

const conversation = new mongoose.Schema(
  {
    partcipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },

  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversation);

export default Conversation;
