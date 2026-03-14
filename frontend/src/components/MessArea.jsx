// import { IoMdArrowBack } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import Dp from "../assets/e.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice.js";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { setMessages } from "../redux/messageSlice.js";
import SenderMessage from "./SenderMessage.jsx";
import ReceiverMessage from "./ReceiverMessage.jsx";

const MessArea = () => {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let image = useRef();
  let { messages } = useSelector((state) => state.messages);
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return; // Don't send empty messages

    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      // FIXED: formData and config are now outside the URL string
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(setMessages([...messages, result.data]));

      // Clear inputs after success
      setInput("");
      setBackendImage("");
      setFrontendImage("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
      );
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setMessages]);




  return (
    <div
      className={`
        ${selectedUser ? "fixed inset-0 z-50 flex" : "hidden"} 
        lg:relative lg:flex lg:w-[70%] 
        flex-col w-full h-full bg-slate-900 border-l border-white/10
      `}
    >
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="w-full h-[70px] lg:h-[85px] bg-gradient-to-br from-[#772bf9] to-[#6022cc] lg:rounded-b-[30px] shadow-xl flex items-center px-4 lg:px-8 gap-3 lg:gap-5 shrink-0">
            <div
              className="cursor-pointer p-1 hover:bg-white/10 rounded-full transition-all"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoMdArrowBack className="h-7 w-7 lg:h-9 lg:w-9 text-white" />
            </div>

            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-white/30 overflow-hidden bg-slate-800 shrink-0">
              <img
                src={selectedUser?.image || Dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg lg:text-2xl tracking-tight leading-none">
                {selectedUser?.name}
              </h1>
             
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            {messages &&
              messages.map((mess) =>
                mess.sender == userData._id ? (
                  <SenderMessage
                    key={mess._id || index} // Added key here
                    image={mess.image}
                    message={mess.message}
                  />
                ) : (
                  <ReceiverMessage
                    key={mess._id || index} // Added key here
                    image={mess.image}
                    message={mess.message}
                  />
                ),
              )}
          </div>

          {/* Emoji Picker Container */}
          {showPicker && (
            <div className="absolute bottom-24 left-6 z-50">
              <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
            </div>
          )}

          {/* Input Form */}
          <div className="w-full p-3 lg:p-6 bg-slate-900/80 backdrop-blur-md relative">
            {/* FIXED: Conditional rendering to prevent empty src error */}
            {frontendImage && (
              <img
                src={frontendImage}
                alt="preview"
                className="w-[80px] absolute bottom-[100px] right-[20%] rounded-lg border-2 border-[#772bf9]"
              />
            )}

            <form
              className="mx-auto w-full max-w-4xl h-12 lg:h-16 bg-white/10 border border-white/10 lg:bg-gradient-to-br lg:from-[#772bf9] lg:to-[#6022cc] rounded-full flex items-center px-3 lg:px-6 gap-2 lg:gap-4 shadow-xl"
              onSubmit={handleSendMessage}
            >
              <button
                type="button"
                className="text-white/70 hover:text-white text-xl lg:text-2xl transition-colors"
                onClick={() => setShowPicker(!showPicker)}
              >
                <RiEmojiStickerLine />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-transparent border-none outline-none text-white text-sm lg:text-base placeholder-white/50"
              />

              <button
                type="button"
                onClick={() => image.current.click()}
                className="text-white/70 hover:text-white text-xl lg:text-2xl transition-colors"
              >
                <FaRegImages />
              </button>

              <button
                type="submit"
                className="bg-[#772bf9] lg:bg-white text-white lg:text-[#6022cc] p-2 lg:p-3 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                <IoSend className="text-lg lg:text-xl" />
              </button>
            </form>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="hidden lg:flex w-full h-full flex-col justify-center items-center text-center px-10">
          <div className="p-8 bg-white/5 rounded-full mb-6">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#772bf9] to-[#6022cc] rounded-2xl rotate-12 shadow-2xl flex items-center justify-center">
              <IoSend className="text-white text-4xl -rotate-12" />
            </div>
          </div>
          <h1 className="text-white font-extrabold text-5xl tracking-tighter mb-4">
            PixoApp
          </h1>
          <p className="text-gray-400 font-medium text-xl max-w-md">
            Select a contact to start your world, just a chat away.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessArea;
