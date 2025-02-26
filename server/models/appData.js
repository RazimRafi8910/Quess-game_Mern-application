import mongoose from "mongoose";

const appSchema = mongoose.Schema({
    currentPlayerId: {
        type: Number,
        requred: true,
        default: 11000001,
    },
});


const AppData = mongoose.model('appdata', appSchema);

export default AppData;