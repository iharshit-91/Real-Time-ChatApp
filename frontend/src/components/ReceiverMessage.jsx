import React, { useEffect, useRef } from "react";
import Dp from "../assets/e.png";
const ReceiverMessage = ({ image, message }) => {
  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

    const handleImageScroll=()=>{
     scroll.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="w-fit max-w-[500px] px-[20px] py-[10px] bg-[#2b3cf9] text-white text-[25px] font-semibold rounded-tl-none rounded-2xl relative left-0  
       gap-[10px] flex flex-col " ref={scroll}
    >
      {image && <img src={image} alt="" className="w-[100px] rounded-lg" onLoad={handleImageScroll}/>}

      {message && <span >{message}</span>}
    </div>
  );
};

export default ReceiverMessage;
