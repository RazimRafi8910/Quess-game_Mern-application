import { Question } from '../models/QuestionModel.js';

export async function getQuestionsByCategory(category) {
    try {
        const question = await Question.find({ category, isListed: true }).lean().select('+answer');
        return {
            questions: question,
            error: false,
            message:"questions found"
        }
    } catch (error) {
        console.error("question generation " + error.message);
        return {
            questions: null,
            error: true,
            message:error.message,
        }
    }
}