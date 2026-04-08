import gameModel from '../models/gameModel.js'


export async function saveGameResultDB(game) {
    if (!game) {
		return false;
	}
    try {
        const { gameId, gameName, host, category, playerLimit, state, gameEndAt, players } = game;
        
        const playerResults = players.map((player)=>{
            return {
                playerId:player[0],
                gameResult:player[1].gameResult,
                gameEndAt
            }
        });

        const data = {
            gameId,
            gameName,
            category,
            host,
            playerLimit,
            players: new Map(players),
            gameState: state,
            gameEndAt,
        };
        // const response = await gameModel.create(data);
    } catch (error) {
        console.log(error);
    } finally {
        return true
    }
}