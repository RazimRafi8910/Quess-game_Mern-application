import mongoose from "mongoose";

const URI = process.env.MONGODB_URI

export default () => {
    mongoose.connect(URI).then(() => {
        console.log("database connected")
    }).catch(error => {
        console.log(error)
    })
}