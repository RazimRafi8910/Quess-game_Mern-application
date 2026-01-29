import { GoogleGenAI } from '@google/genai';
import z, { ZodError } from 'zod';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINAI_API_KEY});

const options = z.object({
    optionChar: z.enum(['A', 'B', 'C', 'D']).describe("corresponding charector of option, type:enum('A','B','C','D')"),
    optionValue:z.string().describe("value of the option, type:string")
})

const questionSchema = z.object({
    question: z.string().describe("quiz question, type:string"),
    options: z.array(options).describe("list of options of the question, type:array(option) "),
    answer:z.enum(['A', 'B', 'C', 'D']).describe("correct option charector of the answer, type:enum('A','B','C','D')")
})

const responseSchema = z.object({
    noQuestion: z.number().describe("number of generated question"),
    category: z.string().describe("category of the question"),
    question:z.array(questionSchema).describe("generated question array"),
})

const responseJson = {
    type: "object",
    properties: {
        noQuestion: {
            type: "integer",
            description: "number of generated question"
        },
        category: {
            type: "string",
            description: "category of the questions"
        },
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string", description: "quiz question"
                    },
                    options: {
                        type: "array",
                        description: "all four options as array of objects with fields for option charector and option value",
                        items: {
                            type: "object",
                            properties: {
                                optionChar: {
                                    type: "string",
                                    description: "charector of the current option"
                                },
                                optionValue: {
                                    type: "string",
                                    description: "value of the current option"
                                }
                            }
                        }
                    },
                    answer: {
                        type: "string",
                        description: "Option charector of the correct answer"
                    }
                }
            },
            description: "list of generated question"
        }
    }
}

export const generateAiQuestion = async (category, noQuestion) => {
    const prompt = `You are an experienced Quiz Master.
Create ${noQuestion} well-structured quiz questions related to the ${category} topic.
Each question should be accurate, unambiguous, and suitable for a quiz competition.
Question should have four options (A,B,C,D) and one answer, generate response based on the given json object`
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:prompt,
            config: {
                responseMimeType: 'application/json',
                responseJsonSchema: responseJson,
            }
            
        });
        
        const questions = responseSchema.parse(JSON.parse(response.text))
        return {
            status: true,
            question: questions,
            error:false
        }
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("error on ai response json schema");
            error.issues.forEach((issue) => {
            console.log({
                code: issue.code,
                path: issue.path,
                message: issue.message,
            });
        });
        } else {
            console.log("something went wrong")
            console.log(error)
        }
        return {
            status: false,
            error:true,
        }
    }
}