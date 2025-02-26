import mongoose from "mongoose";

const { Schema } = mongoose

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        option: {
            type: String,
            required: true
        },
        optionValue: {
            type: String,
            required: true
        }
    }],
    answer: {
        type: String,
        required: true
    },
    isListed: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: String,
        required:true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
},{timestamps:true});

export const Question = mongoose.model('questions', questionSchema);