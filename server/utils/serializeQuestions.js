import { generateQuestionID } from './idGenerator.js';

export function serializeQuestions(questions) {
    for (const question of questions) {
        question._id = generateQuestionID();
    }
    return questions
}