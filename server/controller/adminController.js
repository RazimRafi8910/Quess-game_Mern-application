import mongoose from "mongoose";
import Category from "../models/category.js";
import { Question } from "../models/QuestionModel.js";

const AdminController = {
    getQuestions: async (req, res, next) => {
        try {
            const questions = await Question.find().lean();
            return res.status(200).json({ message: "questions found", success: true, data: questions });
        } catch (error) {
            console.error('[Qestion query error]' + error.message)
            next(error);
        }
    },

    createQuestion: async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            const { question, options, answer, category } = req.body;

            if (!question || !options || !answer || !category) {
                session.endSession()
                return res.status(409).json({ message: "Invalid or missing inputs", success: false });
            }

            const questionCategory = await Category.findOneAndUpdate({ _id: category }, { $inc: { totalQuestions: 1 } });
            if (!questionCategory) {
                await session.abortTransaction()
                session.endSession()
                return res.status(409).json({ message: "Invalid Category", success: false });
            }

            const questionData = {
                question,
                options,
                answer,
                category: questionCategory.categoryName,
                isListed:true
            }
            const newQuestion = await Question.create(questionData);

            if (!newQuestion) {
                await session.abortTransaction()
                session.endSession()
                return res.status(500).json({ success: false, message: "Question not Created" });
            }

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({ success: true, message: "Question Created Successfully", data: newQuestion });
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            console.error('[Question create error]'+error.message);
            next(error);
        }
    },

    deleteQuestion: async (req, res, next) => {
        try {

            const question_id = req.params.question_id;
            

            if (true) {
                return res.status(501).json({ success: false, message: "Function not ready for service" });
            }
        } catch (error) {
            console.error('[Question delete error]'+error.message);
            next(error)
        }
    },

    createCategory: async (req, res, next) => {
        try {
            let { categoryName } = req.body;
            if (!categoryName || categoryName.trim() === "") {
                return res.status(400).json({ message: "Category name missing", success: false });
            }

            categoryName = categoryName.toUpperCase();

            const newCategory = await Category.create({
                categoryName,
                totalQuestions: 0
            });

            if (!newCategory) {
                return res.status(500).json({ message: "failed create category", success: false });
            }

            return res.status(200).json({ message: "category created succesfully",success: true, data:newCategory });
        } catch (error) {
            console.error("[Category Creation Error]:",error.message)
            if (error.code === 11000) {  // MongoDB duplicate key error code
                return res.status(409).json({ success: false, message: "Category already exists." });
            }
            next(error)
        }
    },

    getCategorys: async (req, res, next) => {
        try {
            const categorys = await Category.find().lean();
            return res.status(200).json({ message: "Category Sended", success: true, data: categorys });
        } catch (error) {
            console.error('[Category Query Error]', error.message);
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const categoryId = req.params.category_id;
            
            if (!categoryId) {
                session.endSession()
                return res.status(409).json({ message: "Bad request", success: false });
            }

            const result = await Category.findOneAndDelete({ _id: categoryId });
                        
            if (!result) {
                await session.abortTransaction();
                session.endSession();
                return res.status(409).json({ message: "Category not found", success: false });
            }

            const deletedQuestion = await Question.deleteMany({ category: result.categoryName });

            console.log(deletedQuestion);
            
            return res.status(200).json({ message: "Category deleted", success: true });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('[Category delete Error]', error.message);
            next(error)
        }
    }
}


export default AdminController
