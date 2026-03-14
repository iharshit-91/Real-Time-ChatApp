import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dp from "../assets/e.png";
import { FaSearch, FaTimes } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice.js";
import { Navigate, useNavigate } from "react-router-dom";

const SideBar = () => {
  let { userData, otherUsers, selectedUser } = useSelector(
    (state) => state.user,
  );
  let [isSearching, setIsSearching] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/logout");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`lg:w-[30%] w-full h-screen bg-slate-800 border-r border-slate-700 lg:block ${!selectedUser ? "block" : "hidden"}`}
    >
      <button
        className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-[#772bf9] transition-all duration-200 shadow-lg fixed bottom-[20px] left-[10px] z-50"
        onClick={handleLogout}
      >
        <BiLogOut className="text-xl" />
      </button>

      {/* Header Profile Section */}
      <div className="w-full min-h-[220px] bg-gradient-to-br from-[#772bf9] to-[#6022cc] rounded-b-[40px] shadow-xl flex flex-col justify-between p-6 transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              Hii, {userData?.name || "User"}
            </h1>
            <p className="text-purple-200 text-sm">Welcome back</p>
          </div>
          <div
            className="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-slate-800 shadow-md"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || Dp}
              alt="Profile"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </div>

        {/* Search Interaction Area */}
        <div className="w-full flex items-center gap-[20px] mt-6">
          {!isSearching ? (
            <button
              onClick={() => setIsSearching(true)}
              className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-[#772bf9] transition-all duration-200 shadow-lg"
            >
              <FaSearch className="text-xl" />
            </button>
          ) : (
            <div className="relative animate-in fade-in zoom-in duration-200">
              <form className="w-full h-12 bg-white flex items-center px-4 gap-2 rounded-2xl shadow-inner mb-2">
                <FaSearch className="text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search users..."
                  className="w-full h-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setIsSearching(false)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </form>

              <div className="flex gap-2">
                {otherUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-slate-800 shadow-md flex justify-center items-center "
                  >
                    <img
                      src={user.image || Dp}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-[60vh] overflow-auto flex flex-col gap-[20px] mt-[20px] px-2">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className="w-[95%] h-[60px] flex justify-start items-center gap-[20px] rounded-full border-2 border-[#9a62fa] shadow-gray-700 shadow-lg hover:bg-[#772bf9] cursor-pointer transition-colors"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="w-12 h-12 ml-1 rounded-full border-2 border-white/30 overflow-hidden bg-slate-800 shadow-md flex justify-center items-center ">
              <img
                src={user.image || Dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-white font-bold text-[18px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
