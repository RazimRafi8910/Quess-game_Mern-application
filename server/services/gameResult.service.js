import gameModel from '../models/gameModel.js'


export async function saveGameResultDB(game) {
    if (!game) {
        return false
    }
    console.log(game);
    try {
        const { gameId, gameName, host, category, playerLimit, state, gameEndAt, players } = game;
        const data = {
            gameId,
            gameName,
            category,
            host,
            playerLimit,
            players: new Map(players),
            gameState: state,
            gameEndAt,
        }
        const response = await gameModel.create(data);
        console.log(response)
    } catch (error) {
        console.log(error);
    } finally {
        return true
    }
    
}