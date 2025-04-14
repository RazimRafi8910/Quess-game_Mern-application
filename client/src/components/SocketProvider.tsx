import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Outlet } from 'react-router-dom'
import { Socket } from "socket.io-client";
import SocketClient from "../store/socketManager";

function SocketProvider() {
    //const socketState = useSelector((state: RootState) => state.socketReducer);
    const [socket, setSocket] = useState<Socket | null>(null);
    const userState = useSelector((state: RootState) => state.userReducer.user);

    useEffect(() => {
        //socket instance class
        const newSocket = new SocketClient()
        newSocket.setSocketAuth({
            username: userState?.username,
            id:userState?.id
        });
        setSocket(newSocket.getSocketInstance());
        
        return () => {
            newSocket.disConnectSocket();
        }
    }, []);
    return (
        <>
            <Outlet context={socket}/>
        </>
    )
}

export default SocketProvider