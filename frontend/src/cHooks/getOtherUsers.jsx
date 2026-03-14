import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice.js";

const getOthertUser = () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userData]);
};

export default getOthertUser;
