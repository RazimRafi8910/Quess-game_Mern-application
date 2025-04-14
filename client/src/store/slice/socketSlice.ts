import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import type { WritableDraft } from 'immer';


interface SocketState {
    socket: Socket | null,
    isConnected:boolean
}

type PayloadType = {
    payload: {
        url: string
        username: string | undefined
        id:string | undefined
    }
}

const initialState:SocketState = {
    socket: null,
    isConnected:false
}


const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket (state,action) {
            if (state.socket == null) {
                state.socket = action.payload;
            }
        },
        setSocketConnect (state, action){
            if (state.socket != null) {
                state.isConnected = action.payload
            }
        },
        disConnectSocketState(state) {
            state.socket?.disconnect();
            state.socket = null;
            state.isConnected = false;
        },
        connectToSocket({ socket, isConnected }, { payload }: PayloadType) {
            // Error, TODO : isConnected is become false ater connecte
            
            if (socket == null) {

                const socketInstance = io(payload.url, {
                    withCredentials: true
                });

                socketInstance.auth = {
                    username: payload.username,
                    id:payload.id
                }

                socketInstance.on('connect', () => {
                    console.log('user connected to socket');
                    isConnected = true;
                });

                socketInstance.on('disconnect', () => {
                    console.log("user disconnected from socket");
                    isConnected = false;
                });

                //possible errror
                socket = socketInstance as unknown as WritableDraft<Socket>
                isConnected = true
                console.log(socket);
            }
        },
        disconnectSocket({ socket, isConnected }) {
            if (socket != null) {
                socket.disconnect();
                isConnected = false
                socket = null;
                console.log("User disconnected");
            }
        }
    }
});

export const { setSocket,setSocketConnect,disConnectSocketState, connectToSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;