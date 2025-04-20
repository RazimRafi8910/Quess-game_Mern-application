import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorageItem } from "../../utils/localStateManager";


type GameStateType = {
    gameId: string
    playerId: string
}

const initialState: GameStateType = {
    gameId: getLocalStorageItem('gameId') || '',
    playerId:''
} 


const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameState: (state, actions) => {
            if (state.gameId == '') {
                state.gameId = actions.payload.gameId
                state.playerId = actions.payload.playerId
            }
        },
        removeGameState: (state, action) => {
            if (state.gameId !== '') {
                state.gameId = ''
                state.playerId = ''
            }
        }
    }
})

export const { setGameState, removeGameState } = gameSlice.actions;
export default gameSlice.reducer;