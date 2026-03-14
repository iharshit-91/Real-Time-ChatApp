// import {configureStore} from "@reduxjs/toolkit"
// import userSlice  from "./userSlice.js"
// import messageSlice from "./messageSlice.js"

// export const store=configureStore({
//     reducer:{
//         user:userSlice,
//         messages:messageSlice
//     }    

// })

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import messageSlice from "./messageSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    messages: messageSlice,
  },
  // Serializability check ko ignore karne ke liye ye middleware add karein
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "user/setSocket", 
          "user/setOtherUsers",
          "user/setOnlineUsers"
        ],
        ignoredPaths: [
          "user.socket", 
          "user.otherUsers", 
          "user.onlineUsers"
        ],
      },
    }),
});