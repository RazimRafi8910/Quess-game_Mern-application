import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice"
import gameSlice from './slice/gameSlice'

export const store = configureStore({
    reducer: {
        userReducer: userSlice,
        gameReducer: gameSlice,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

