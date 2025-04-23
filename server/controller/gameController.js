import { getGameLobby } from "../socket/socketManager.js";

export const createGame = (req, res, next) => {
    try {
        const user = req.user;
        const { roomName, noPlayers, password, havePassword, category, hostName } = req.body;

        if (!roomName || !hostName || !noPlayers || !category) {
            console.log(req.body);
            
            return res.status(409).json({ success: false, message: "invalid request" });
        }
        
        if (havePassword) {
            if (password.length < 3) {
                return res.status(409).json({ success: false, message: "password must be more than 3 letter" });
            }
        }

        const gameLobby = getGameLobby(req);
        const gameHost = {
            username: hostName,
            user_id:user.user_id
        }
        const newGame = gameLobby.createGame(gameHost, category, roomName, password, noPlayers,user.user_id);

        if (!newGame) {
            return res.status(500).json({ success: false, message: "game not created" });
        }

        //response data
        const data = {
            gameId: newGame.gameId,
            playerId:user.user_id
        }

        return res.status(200).json({ success: true, message: "game created successfuly", data });
    } catch (error) {
        next(error);
    }
}

export const getGameDetails = (req, res, next) => {
    const gameLobby = getGameLobby(req);
    const gameId = req.params.game_id;
    
    if (!gameId) {
        return res.status(409).json({ success: false, message: "game id not found" });
    }

    const game = gameLobby.getGameState(gameId);

    if (!game) {
        return res.status(404).json({ success: false, message: "Game not found" });
    }
    
    const data = {
        gameId: game.gameId,
        gameName:game.gameName
    }

    return res.status(200).json({ success: true, message: "game found", data });
}


export const getGameRooms = (req, res, next) => {
    const gameLobby = getGameLobby(req);
    const data = gameLobby.getAllGameRooms()
    return res.status(200).json({ success: true, data });
}