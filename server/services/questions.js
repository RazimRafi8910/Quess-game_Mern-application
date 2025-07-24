import { Question } from '../models/QuestionModel.js';

export async function getQuestionsByCategory(category) {
    try {
        const question = await Question.find({ category, isListed: true }).lean();
        return {
            question,
            error: false,
            message:"questions found"
        }
    } catch (error) {
        console.error("question generation " + error.message);
        return {
            error: true,
            message:error.message,
        }
    }
}