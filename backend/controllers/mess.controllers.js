//
// gemini

import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/mess.model.js";
import { getRecSocketId, io } from "../socket/socket.js"; 

// 1. Send Message Controller
export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;

    if (!receiver) {
      return res.status(400).json({ message: "Receiver ID is missing!" });
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // यहाँ स्पेलिंग चेक करें: अगर Schema में 'participants' है तो उसे ठीक करें
    let conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] }, 
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        partcipants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getRecSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Backend Error (sendMessage):", error);
    return res.status(500).json({ message: `send message error: ${error.message}` });
  }
};

// 2. Get Messages Controller (इसे आपने मिस कर दिया था)
export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;

    const conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]); // अगर चैट नहीं है तो खाली Array भेजें
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Backend Error (getMessages):", error);
    return res.status(500).json({ message: `get message error: ${error.message}` });
  }
};