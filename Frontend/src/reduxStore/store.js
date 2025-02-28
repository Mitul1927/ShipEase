import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice2';

const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

export default store;
