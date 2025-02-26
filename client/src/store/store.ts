import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice"

export const store = configureStore({
    reducer: {
        userReducer:userSlice,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

