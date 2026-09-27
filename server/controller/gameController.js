import Category from "../models/category.js";
import { User } from "../models/userModel.js";
import { getGameLobby } from "../socket/socketManager.js";

export const createGame = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        let { roomName, noPlayers, password, havePassword, category, hostName, hostSocketId, aiQuestion } = req.body;

        const user = await User.findById(userId).select("permission").lean();

        if (!user) {
            return res.status(401).json({ success: false, message: "user not found" });
        }

        if (!roomName || !hostName || !noPlayers || !category || !hostSocketId) {
            console.log(req.body);
            return res.status(409).json({ success: false, message: "invalid request" });
        }

        if (havePassword) {
            if (password.length < 3) {
                return res.status(409).json({ success: false, message: "password must be more than 3 letter" });
            }
        }

        if (!user.permission.aiAccess && aiQuestion) {
            aiQuestion = false; // only user with permission can access ai questions
        }

        const gameLobby = getGameLobby(req);
        const gameHost = {
            username: hostName,
            user_id: userId,
        }
        const newGame = await gameLobby.createGame(gameHost, category, roomName, password, noPlayers, userId, hostSocketId, aiQuestion);

        if (!newGame) {
            return res.status(500).json({ success: false, message: "game not created" });
        }

        //response data
        const data = {
            gameId: newGame.gameId,
            playerId: userId,
        }

        return res.status(200).json({ success: true, message: "game created successfuly", data });
    } catch (error) {
        next(error);
    }
}



export const getGameDetails = async (req, res, next) => {
    const gameLobby = getGameLobby(req);
    const gameId = req.params.game_id;

    if (!gameId) {
        return res.status(409).json({ success: false, message: "game id not found" });
    }

    const game = await gameLobby.getGameState(gameId);

    if (!game) {
        return res.status(404).json({ success: false, message: "Game not found" });
    }

    const data = game.toJson();

    return res.status(200).json({ success: true, message: "game found", data });
}

export const checkGamePassword = async (req, res) => {
    const { password, gameId } = req.body;
    if (!password || password == '') {
        return res.status(409).json({ success: false, message: "missing or invalid password" });
    }

    if (password.length < 3) {
        return res.status(409).json({ success: false, message: "password must be 3 letters" });
    }

    const gameLobby = getGameLobby(req);
    const game = await gameLobby.getGameState(gameId)

    if (!game) {
        return res.status(409).json({ success: false, message: "Game not found" });
    }

    const result = game.checkGamePassword(password);
    if (!result) {
        return res.status(401).json({ success: false, message: "Password not matched" });
    }

    return res.status(200).json({
        success: true,
        message: "Password matched",
        data: {
            status: result
        }
    });
}

export const getCategorys = async (req, res, next) => {
    try {
        const categorys = await Category.find().lean();
        res.status(200).json({ success: true, message: "categorys found", data: categorys });
    } catch (error) {
        console.log('[Category query error]', error.message);
        next(error)
    }
}

export const getGameRooms = async (req, res, next) => {
    const gameLobby = getGameLobby(req);
    const data = await gameLobby.getAllGameRooms({ localGameOnly: false })
    return res.status(200).json({ success: true, data });
}