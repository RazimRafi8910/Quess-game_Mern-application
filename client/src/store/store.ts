import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice"
import socketSlice from './slice/socketSlice';

export const store = configureStore({
    reducer: {
        userReducer: userSlice,
        socketReducer:socketSlice,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

