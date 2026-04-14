import { ServerSocketEvents } from '../utils/constants.js';
import { handleSocketGameEvent } from './gameManager.js'
import { handleAuthMiddleware } from './socketHelper.js';
/**
 * 
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io 
 * @param {InstanceType} gameLobby 
 */


export const initializeSocket = (io, gameLobby) => {

    io.use(handleAuthMiddleware)    

    io.on('connection', (socket) => {
        try {
            gameLobby.addPlayer(socket.player, socket.id);
            
            //development code
            // console.log(gameLobby.players.size);
            // console.log(socket.handshake.auth);

            io.emit(ServerSocketEvents.LOBBY_PLAYER_UPDATE, { players: gameLobby.players.size });

            handleSocketGameEvent(io,socket,gameLobby)
            
            socket.on('disconnect', () => {
                gameLobby.removePlayer(socket.player.user_id);
                socket.leave()
                console.log('disconnected');
                io.emit(ServerSocketEvents.LOBBY_PLAYER_UPDATE, { players: gameLobby.players.size });
            });


        } catch (error) {
            console.error(error);
            socket.emit(ServerSocketEvents.SOCKET_ERROR, error.message || "something went wrong with socket connection");
        }
    });
}

// function to get current lobby state
export function getGameLobby(req) {
    return req.app.get('lobby');
}