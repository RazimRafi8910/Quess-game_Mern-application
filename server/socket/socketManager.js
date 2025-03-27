import jwt from 'jsonwebtoken';

/**
 * 
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io 
 * @param {InstanceType} gameLobby 
 */


export const initializeSocket = (io, gameLobby) => {
    io.on('connection', (socket) => {
        try {
            gameLobby.addPlayer();

            const cookie = socket.handshake.headers.cookie;
            const token = cookie.split('=')[1];

            if (!token) {
                throw new Error("Un-authorized handshake. Token is missing")
            }

            socket.join(socket.handshake.auth.id);

            const player = jwt.verify(token, process.env.JWT_KEY);

            socket.player = player;

            //TODO:find player from db using handshake auth id if player is undefined

            
            //development code
            console.log(gameLobby.players)
            console.log(socket.handshake.auth);
            socket.emit('current-lobby', { players: gameLobby.players })
            

            socket.on('disconnect', () => {
                gameLobby.removePlayer();
                socket.leave()
                console.log('disconnected');
            });
        } catch (error) {
            console.error(error);
            socket.emit('socket-error', error.message || "something went wrong with socket connection");
        }
    });
}


export function getGameLobby(req) {
    return req.app.get('lobby');
}