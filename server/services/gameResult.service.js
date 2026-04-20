import gameModel from '../models/gameModel.js'
import PlayerGameResultModel from '../models/playerGameResultModel.js';


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
                status:player.status,
                completed:player.completed,
                socketId:player.socketId,
                user_id: id
            }
        });

        const gameResultData = {
            gameId,
            gameName,
            category,
            host,
            playerLimit,
            players: playerList,
            gameState: state,
            gameEndAt,
        }

        const playerGameresult = players.map((player)=>(
            PlayerGameResultModel.create({ 
                gameId,
                playerId:player[0],
                gameResult:player[1].gameResult,
                gameEndAt
            })
        ))

        const dbResponse = await Promise.allSettled([...playerGameresult,gameModel.create(gameResultData)]);

        for (const response of dbResponse) {
            if(response.status == 'rejected'){
                console.log(`[game save service] failed db save:${response.reason}`)
            }
        }
    } catch (error) {
        console.log("[saveGame_service] ", error.message);
        return { status:false };
    }
}