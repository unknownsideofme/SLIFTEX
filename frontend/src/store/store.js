import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../features/User";
import { sigininslice } from "../features/SignIn";

const store = configureStore({
  reducer: {
    userSlice: userSlice.reducer,
    sigininslice: sigininslice.reducer,
  },
});

export default store;
