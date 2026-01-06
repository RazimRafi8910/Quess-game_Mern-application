import mongoose from "mongoose";
import AppData from "./appData.js";

const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "The username is required"],
        min: 3,
        index:true,
        unique: true,
    },
    playerId: {
        type: Number,
        unique: true,
        index:true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        min: [6, "password required minimum 6 charactors"],
        select:false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const data = await AppData.findOneAndUpdate({}, { $inc: { currentPlayerId: 1 }, }, { new: true });
    if (data) {
        this.playerId = data.currentPlayerId;
        next();
    }
    next(new Error("app data is not found"));
});


export const User = mongoose.model('users', userSchema)