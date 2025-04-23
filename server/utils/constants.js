export const SocketEvents = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    ERROR: 'socket_error',
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    SOCKET_ERROR: 'socket_error'
}


export const ServerSocketEvents = {
    CONNECTION:'connection',
    DISCONNECT:'disconnect',
    LOBBY_PLAYER_UPDATE: 'current_players',
    LOBBY_ROOM_UPDATE: 'current_rooms',
    GAME_ROOM_UPDATE: 'room_update',
    SOCKET_ERROR: 'socket_error'
}