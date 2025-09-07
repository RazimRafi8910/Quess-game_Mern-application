export const SocketEvents = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    CLOSE_ROOM: 'close_room',
    START_GAME: 'start_game',
    GAME_RUN:'game_run',
    PLAYER_UPDATE:'player_update',
    SOCKET_ERROR: 'socket_error'
}

export const GameState = {
    LOBBY:'Lobby',
    STARTED: 'Started',
    RUNNING: 'Running',
    STOPED:'stoped',
    FINISHED:'Finished',
}


export const ServerSocketEvents = {
    CONNECTION:'connection',
    DISCONNECT: 'disconnect',
    GAME_ROOM_CLOSED: 'room_closed',
    GAME_ROOM_STARTING:'room_starting',
    LOBBY_PLAYER_UPDATE: 'current_players',
    LOBBY_ROOM_UPDATE: 'current_rooms',
    GAME_ROOM_UPDATE: 'room_update',
    GAME_ROOM_ERROR:'game_error',
    SOCKET_ERROR: 'socket_error',
    GAME_ROOM_RUNNING:'game_running',
}