import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice.js";
const Login = () => {
  let navigate = useNavigate();
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let dispatch = useDispatch();
  // let { userData } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      navigate("/");
      setLoading(false);
      setEmail("");
      setPassword("");
      setErr("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-[500px] h-[600px] bg-gray-800 rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#772bf9] rounded-b-[50%]  shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="font-bold text-[30px] text-white">
            <span className="text-[#42d7f5]">Pixo</span>App
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleLogin}
        >
          {/* email */}
          <input
            type="email"
            placeholder="email"
            className="font-bold w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-white rounded-lg  shadow-gray-600 shadow-lg text-[19px]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="w-[90%] h-[50px] border-2 border-[#772bf9] overflow-hidden  shadow-gray-600 shadow-lg  rounded-lg relative">
            {/* password */}
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="password"
              className="font-bold w-full h-full outline-none px-[20px] py-[10px] bg-black text-white text-[19px]"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute top-[10px] right-[20px] text-[19px] text-[#772bf9] font-semibold cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {`${show ? "hidden" : "show"}`}
            </span>
          </div>

          {err && <p className="text-white">{err}</p>}

          <button
            className="px-[20px] py-[10px] bg-[#772bf9] rounded-2xl  shadow-gray-600 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p
            className="mt-[10px] text-white text-[20px] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create a new Account ?{" "}
            <span className="text-[#d8c5f9] font-semibold">SignUp</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
