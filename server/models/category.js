import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique:true,
    },
    totalQuestions: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Category = mongoose.model('category', categorySchema);

export default Category;