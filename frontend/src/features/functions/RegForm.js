import { registerUserCall } from "../../api_utils/Register.js";

export const updateUser = (state, action) => {
  const { firstName, lastName, email, password, confirmpass, accessLvl } = action.payload;

  state.firstName = firstName;
  state.lastName = lastName;
  state.email = email;
  state.password = password;
  state.confirmpass = confirmpass;
  state.accessLvl = accessLvl;

  // Corrected: pass an object with proper key-value pairs
  registerUserCall({
    
    firstName,
    lastName,
    email,
    password,
    previlages: accessLvl, // assuming 'accessLvl' maps to 'privileges'
  });
};

export const resetUser = (state) => {
    ;
    state.firstName = "";
    state.lastName = "";
    state.email = "";
    state.password = "";
    state.confirmpass = "";
    state.accessLvl = "";
}
