
export const updateSignIn = (state, action) => {
    const { email, password, accessLvl, rememberMe } = action.payload;

    state.email = email;
    state.password = password;
    state.accessLvl = accessLvl;
    state.rememberMe = rememberMe;

    

} ; 
export const resetSignIn = (state) => {
    state.email = "";
    state.password = "";
    state.accessLvl = "";
    state.rememberMe = false;
}; 