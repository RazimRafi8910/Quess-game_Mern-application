import mongoose, { Schema } from 'mongoose';

const gameSchema = new Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    gameName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    host: {
        type: {
            username: String,
            user_id: mongoose.Types.ObjectId,
        },
        required: true,
        _id:false
    },
    playerLimit: {
        type: Number,
        required: true,
    },
    gameState: {
        type: String,
        required: true
    },
    gameEndAt: {
        type: Number,
        required: true
    },
    players: {
        type: Map,
        _id:false,
        of: {
            usename: String,
            role: { type: String, enum: ['host', 'player'] },
            isReady: Boolean,
            status: Boolean,
            completed: Boolean,
            socketId: String
        }
    }
});


const gameModel = mongoose.model('game', gameSchema);




export default gameModel;