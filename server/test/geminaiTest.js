import './loadEnv.js';
import { generateAiQuestion } from "../services/geminAPI.service.js"; 
import { serializeQuestions } from '../utils/serializeQuestions.js';
const NO_QUESTIONS = 5;
const CATEGORYS = ['IT', 'Programming', 'General'];

async function MainTest() {
    let i = 0
    for (const element of CATEGORYS) {
        i++;
        try {
            const result = await generateAiQuestion(element, NO_QUESTIONS);
            if (result.error) {
                throw new Error(result.message)
            }
            console.log(`test ${i} success`);
            break
        } catch (error) {
            console.log(`test ${i} failed`);
        } finally {
            console.log(`test ${i} completed`);
        }
    }
}

MainTest()



