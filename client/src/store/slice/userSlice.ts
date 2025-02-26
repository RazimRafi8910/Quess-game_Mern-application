import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
    logined?: boolean;
    user: UserData | null;
} 

export type UserData = {
    role:string
    username: string
    email: string
    id:string
}

const initialState:UserState = {
    logined:false,
    user: null
} 

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, { payload }: PayloadAction<UserData>) => {
            state.logined = true
            state.user = payload;
            return state
        },
        logoutUser: (state) => {
            state.logined = false;
            state.user = null
            return state
        }
    }
})

export const { loginUser,logoutUser } = userSlice.actions
export default userSlice.reducer
