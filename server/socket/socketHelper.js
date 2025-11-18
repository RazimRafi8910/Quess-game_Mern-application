
export const validateSocketRoom = (socket, gameId) => {
    return socket.rooms.has(gameId);
}