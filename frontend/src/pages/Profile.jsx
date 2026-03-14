// import React, { useRef } from "react";
// import Dp from "../assets/e.png";
// import { CiCamera } from "react-icons/ci";
// import { useDispatch, useSelector } from "react-redux";
// import { IoMdArrowBack } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { serverUrl } from "../main.jsx";
// import { setUserData } from "../redux/userSlice.js";

// const Profile = () => {
//   let { userData } = useSelector((state) => state.user);
//   let dispatch = useDispatch();
//   let navigate = useNavigate();

//   let [name, setName] = useState(userData.name || "");
//   let [frontendImage, setFrontendImage] = useState(userData.image || Dp);
//   let [backendImage, setBackendImage] = useState(null);
//   let image = useRef();
//   let [saving, setSaving] = useState(false);

//   const handleImage = (e) => {
//     let file = e.target.files[0];
//     setBackendImage(file);
//     setBackendImage(URL.createObjectURL(file));
//   };

//   const handleProfile = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       let formData = new FormData();
//       formData.append("name", name);
//       if (backendImage) {
//         formData.append("image", backendImage);
//       }

//       let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
//         withCredentials: true,
//       });
//       setSaving(false);

//       dispatch(setUserData(result.data));
//     } catch (error) {
//       console.log(error);
//       setSaving(false);
//     }
//   };
//   return (
//     <div
//       className="w-full h-[100vh] bg-slate-900 flex
//     flex-col justify-center items-center gap-[25px]"
//     >
//       <div
//         className="fixed top-[20px] left-[20px] cursor-pointer"
//         onClick={() => {
//           navigate("/");
//         }}
//       >
//         <IoMdArrowBack className="h-[50px] w-[50px] text-white" />
//       </div>

//       <div
//         className="bg-slate-900 rounded-full border-4 border-[#772bf9]
//        shadow-gray-800 shadow-lg relative"
//         onClick={() => image.current.click()}
//       >
//         <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center">
//           <img src={frontendImage} alt="" className="h-[100%]" />
//         </div>
//         <CiCamera className="absolute h-20 w-20   bottom-2 left-1/2 -translate-x-1/2" />
//       </div>
//       <form
//         className="w-[95%] max-w-[500px] flex flex-col gap-[28px] items-center justify-center"
//         onSubmit={handleProfile}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           ref={image}
//           hidden
//           onChange={handleImage}
//         />

//         <input
//           type="text"
//           placeholder="Enter your name"
//           className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-white rounded-lg  font-bold  shadow-gray-800 shadow-lg text-[19px]"
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//         />
//         <input
//           type="text"
//           readOnly
//           className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-slate-500 rounded-lg  shadow-gray-800 shadow-lg text-[19px]"
//           value={userData?.userName}
//         />
//         <input
//           type="email"
//           readOnly
//           className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-slate-500 rounded-lg  shadow-gray-800 shadow-lg text-[19px]"
//           value={userData?.email}
//         />

//         <button
//           className="px-[20px] py-[10px] bg-[#772bf9] rounded-2xl  shadow-gray-600 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
//           disabled={saving}
//         >
//           {saving ? "Saving..." : "Save Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profile;

//

import React, { useRef, useState } from "react";
import Dp from "../assets/e.png";
import { CiCamera } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { setUserData } from "../redux/userSlice.js";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State initialization with fallbacks
  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || Dp);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const [saving, setSaving] = useState(false);

  // Corrected handleImage function
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file); // Store file object for backend
      setFrontendImage(URL.createObjectURL(file)); // Create preview URL for UI
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      // Only append if a new image was selected
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSaving(false);
      dispatch(setUserData(result.data));
    } catch (error) {
      console.error("Update failed:", error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-900 flex flex-col justify-center items-center gap-[25px]">
      <div
        className="fixed top-[20px] left-[20px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack className="h-[50px] w-[50px] text-white" />
      </div>

      {/* Profile Image Section */}
      <div
        className="bg-slate-900 rounded-full border-4 border-[#772bf9] shadow-gray-800 shadow-lg relative cursor-pointer"
        onClick={() => image.current.click()}
      >
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center bg-gray-800">
          <img
            src={frontendImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <CiCamera className="absolute h-10 w-10 text-white bg-[#772bf9] rounded-full p-2 bottom-2 left-1/2 -translate-x-1/2" />
      </div>

      <form
        className="w-[95%] max-w-[500px] flex flex-col gap-[28px] items-center justify-center"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />

        <input
          type="text"
          placeholder="Enter your name"
          className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-white rounded-lg font-bold shadow-gray-800 shadow-lg text-[19px]"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="text"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-slate-500 rounded-lg shadow-gray-800 shadow-lg text-[19px]"
          value={userData?.userName || ""}
        />

        <input
          type="email"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#772bf9] px-[20px] py-[10px] bg-black text-slate-500 rounded-lg shadow-gray-800 shadow-lg text-[19px]"
          value={userData?.email || ""}
        />
        <button
          type="submit"
          className="px-[20px] py-[10px] bg-[#772bf9] text-white rounded-2xl shadow-gray-600 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:bg-[#621fcf] transition-all disabled:bg-gray-600"
          disabled={saving}
          onClick={() => navigate("/")}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
