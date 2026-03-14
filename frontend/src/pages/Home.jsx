import React from "react";
import SideBar from "../components/SideBar.jsx";
import MessArea from "../components/MessArea.jsx";
import getMessages from "../cHooks/getMassages.jsx";

const Home = () => {

  getMessages()
  return (
    <div className="flex w-full h-[100vh]">
      <SideBar />
      <MessArea />
    </div>
  );
};

export default Home;
