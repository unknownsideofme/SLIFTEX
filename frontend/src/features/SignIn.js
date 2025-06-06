import { createSlice } from "@reduxjs/toolkit";
import { updateSignIn, resetSignIn } from "./functions/SignInFn";

const initialState = {
  email: "",
  password: "",
  accessLvl: "", 
  rememberMe: false,
};

export const sigininslice = createSlice({
  name: "signin",
  initialState,
  reducers: { 
    updateSignIn, 
    resetSignIn
  }
});

// Export the action creator
export const {
    updateSignIn: updateSignInAction,
    resetSignIn: resetSignInAction
} = sigininslice.actions;

// Export the reducer
export default sigininslice.reducer;
