import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState:{
        isAuthenticated : false,
        role : null,
        email : null,
        userId: null,
        token:null
    },
    reducers:{
        login: (state,action)=>{
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.email = action.payload.email;
            state.userId = action.payload.id;
            state.token = action.payload.token;
        },
        logout: (state,action)=>{
            state.isAuthenticated = false;
            state.role = null;
            state.userId = null;
            state.email = null;
            state.token = null;
        }
    }
});
export const {login,logout} = authSlice.actions;
export default authSlice.reducer;