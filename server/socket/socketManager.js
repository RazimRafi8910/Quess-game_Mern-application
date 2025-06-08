import jwt from 'jsonwebtoken';
import { ServerSocketEvents } from '../utils/constants.js';
import { handleSocketGameEvent } from './gameManager.js'
import { getCookieByName } from '../utils/cookieExtract.js'
/**
 * 
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io 
 * @param {InstanceType} gameLobby 
 */


export const initializeSocket = (io, gameLobby) => {
    io.on('connection', (socket) => {
        try {

            const cookie = socket.handshake.headers.cookie;
            const token = getCookieByName(cookie, 'token');

            if (!token) {
                throw new Error("Un-authorized handshake. Token is missing")
            }

            //socket.join(socket.handshake.auth.id);
            const player = jwt.verify(token, process.env.JWT_KEY);

            socket.player = player;
            gameLobby.addPlayer(socket.player, socket.id);

            //TODO:find player from db using handshake auth id if player is undefined

            
            //development code
            console.log(gameLobby.players.size);
            console.log(socket.handshake.auth);

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