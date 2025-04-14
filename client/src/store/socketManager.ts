import { io, Socket } from "socket.io-client";


export default class SocketClient {
    socket: Socket | null = null;
    constructor() {
        this.socket = io('http://localhost:3001', {
            withCredentials: true,
        });
    }

    getSocketInstance():Socket | null {
        if (this.socket != null) {
            return this.socket;
        }
        return null;
    }
    
    setSocketAuth(data:{username?:string,id?:string}) {
        if (this.socket !== null) {
            this.socket.auth = {
                username: data.username,
                id:data.id
            }
        }
    }

    disConnectSocket() {
        if (this.socket !== null) {
            this.socket.disconnect()
            console.log("socket disconneded");
        }
    }
}


//TODO:complete logic
// a function that returns another function 
// export const connectTOSocket = (payload: PayloadType) => (dispatch: AppDispatch) => {
//     const socket = io(payload.url, {
//         withCredentials: true
//     });
//     socket.auth = {
//         username: payload.username,
//         id:payload.id
//     }
//     socket.on('connect', () => {
//         console.log("user connected");
//         dispatch(setSocket(socket));
//         dispatch(setSocketConnect(true))
//     });

//     socket.on('disconnect', () => {
//         console.log("user not connected");
//         dispatch(disConnectSocketState());
//     })
// }

// export const disconnectSocket = () => (dispatch: AppDispatch) => {
//     console.log("user disconnectd")
//     dispatch(disConnectSocketState());
// }