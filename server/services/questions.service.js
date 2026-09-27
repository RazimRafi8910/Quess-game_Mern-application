import { Question } from '../models/QuestionModel.js';

export async function getQuestionsByCategory(category) {
    try {
        const question = await Question.find({ category, isListed: true }).lean().select('+answer');
        if (question.length == 0) {
            return {
                status: false,
                questions: [],
                error: true,
                message: "no questions found in this category"
            }
        }

        return {
            status: true,
            questions: question,
            error: false,
            message: "questions found"
        }
    } catch (error) {
        console.error("question generation " + error.message);
        return {
            status: false,
            questions: null,
            error: true,
            message: error.message,
        }
    }
}