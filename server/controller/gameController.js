import { getGameLobby } from "../socket/socketManager.js";

export const createGame = (req, res, next) => {
    try {
        const { roomName, noPlayers, password, category, hostName } = req.body;

        if (!roomName || !hostName || !noPlayers || !category) {
            console.log(req.body);
            
            return res.status(409).json({ success: false, message: "invalid request" });
        }

        const gameLobby = getGameLobby(req);

        const result = gameLobby.createGame(hostName, category,roomName);

        if (!result) {
            return res.status(500).json({ success: false, message: "game not created" });
        }

        return res.status(200).json({ success: true, message: "game created successfuly", data: result });
    } catch (error) {
        next(error);
    }
}


export const getGameRooms = (req, res, next) => {
    const gameLobby = getGameLobby(req);
    const data = gameLobby.getAllGameRooms()
    return res.status(200).json({ success: true, data });
}