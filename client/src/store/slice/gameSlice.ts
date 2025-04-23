import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "../../utils/localStateManager";


type GameStateType = {
    gameId: string | null
    playerId: string
}

const initialState: GameStateType = {
    gameId: getLocalStorageItem('gameId') || null,
    playerId:''
} 


const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameState: (state, actions) => {
            if (state.gameId == null) {
                setLocalStorageItem('gameId', actions.payload.gameId);
                state.gameId = actions.payload.gameId
                state.playerId = actions.payload.playerId
            }
        },
        removeGameState: (state) => {
            if (state.gameId !== null) {
                state.gameId = ''
                state.playerId = ''
                removeLocalStorageItem('gameId')
            }
        }
    }
})

export const { setGameState, removeGameState } = gameSlice.actions;
export default gameSlice.reducer;