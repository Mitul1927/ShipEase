import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState:{
        isAuthenticated : false,
        role : null,
        email : null,
        userId: null,
        token:null,
        image : null,
        username:null,
    },
    reducers:{
        login: (state,action)=>{
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.email = action.payload.email;
            state.userId = action.payload.id;
            state.token = action.payload.token;
            state.image = action.payload.image;
            state.username = action.payload.username;
        },
        logout: (state,action)=>{
            state.isAuthenticated = false;
            state.role = null;
            state.userId = null;
            state.email = null;
            state.token = null;
            state.username = null;
            state.image = null;
        }
    }
});
export const {login,logout} = authSlice.actions;
export default authSlice.reducer;