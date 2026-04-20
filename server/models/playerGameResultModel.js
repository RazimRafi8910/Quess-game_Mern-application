import mongoose from 'mongoose';

const playerGameResultSchema = new mongoose.Schema(
    {
        gameId: {
            type: String,
            required: true,
        },
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        gameEndAt: {
            type: Number,
            required: true,
        },
        gameResult: {
            _id: false,
            score: { type: Number, default: null },
            correct: { type: Number, default: null },
            incorrect: { type: Number, default: null },
            notAttended: { type: Number, default: null },
        },
    },
    { timestamps: true }
);

// Fast profile sorting by most recent finished games
playerGameResultSchema.index({ playerId: 1, gameEndAt: -1 });

// Ensure a player has at most one result per game
//playerGameResultSchema.index({ playerId: 1, gameId: 1 }, { unique: true });

const PlayerGameResultModel = mongoose.model('playerGameResult', playerGameResultSchema);

export default PlayerGameResultModel;