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
    
    resetSignIn,
     updateSignIn,
  }
});


export const {
    updateSignIn: updateSignInAction,
    resetSignIn: resetSignInAction
} = sigininslice.actions;

// Export the reducer
export default sigininslice.reducer;
