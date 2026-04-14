import gameModel from '../models/gameModel.js'
import playerGameResultModel from '../models/playerGameResultModel.js';


export async function saveGameResultDB(game) {
    if (!game) {
		return {status : false};
	}
    try {
        const { gameId, gameName, host, category, playerLimit, state, gameEndAt, players } = game;

        const playerList = players.map(([id,player])=>{
            return {
                username:player.username,
                role:player.role,
                completed:player.completed,
                socketId:player.socketId,
                user_id:id,
            }
        });

        const gameData = {
            gameId,
            gameName,
            category,
            host,
            playerLimit,
            players: playerList,
            gameState: state,
            gameEndAt,
        };
        
        // saves game and player result
        const gameSaveResponse = await Promise.all([gameModel.create(gameData),...players.map(async(player)=>{
            const data = {
                playerId:player[0],
                gameResult:player[1].gameResult,
                gameId,
                gameEndAt
            };
            const response = await playerGameResultModel.insertOne(data);
            return response
        })]);

        if(!gameSaveResponse) {
            throw new Error("Failed to save game");
        }

        console.log(`[saveGame_service] game ${gameId} saved to db`);
        return { status:true };
    } catch (error) {
        console.log("[saveGame_service] ", error.message);
        return { status:false };
    }
}