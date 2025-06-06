import { createSlice } from "@reduxjs/toolkit";
import {updateUser, resetUser} from "./functions/RegForm";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmpass: "",
  accessLvl: ""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser ,resetUser 
  }
});

// Export the action creator
export const { updateUser: updateUserAction, 
    resetUser: resetUserAction
 } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
