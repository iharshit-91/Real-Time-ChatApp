// import { useEffect } from "react";
 import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice.js";

const getMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      // FIX 1: Add a guard clause. If no user is selected, stop here.
      if (!selectedUser?._id) return;

      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]); // FIX 2: Added dispatch to dependency array
};

export default getMessages;