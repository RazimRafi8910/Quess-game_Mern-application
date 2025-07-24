import Category from "../models/category.js";
import { Question } from "../models/QuestionModel.js";
import { User } from "../models/userModel.js";

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
        try {
            const { question, options, answer, category } = req.body;

            if (!question || !options || !answer || !category) {
                return res.status(409).json({ message: "Invalid or missing inputs", success: false });
            }

            const questionCategory = await Category.findOneAndUpdate({ _id: category }, { $inc: { totalQuestions: 1 } });
            if (!questionCategory) {
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
                return res.status(500).json({ success: false, message: "Question not Created" });
            }

            return res.status(201).json({ success: true, message: "Question Created Successfully", data: newQuestion });
        } catch (error) {
            console.error('[Question create error]'+error.message);
            next(error);
        }
    },

    deleteQuestion: async (req, res, next) => {
        try {
            const question_id = req.params.question_id;
            
            if (!question_id) {
                session.endSession()
                return res.status(409).json({ message: "Question ID is missing", success: false });
            }

            const questionDelete = await Question.findByIdAndDelete({ _id: question_id });

            if (!questionDelete) {
                return res.status(500).json({ message: "Qeustion not deleted ", success: false, });
            }
            
            if (questionDelete.category) {
                const questionCategoryUpdate = await Category.updateOne(
                    { categoryName: questionDelete.category },
                    { $inc: { totalQuestions: -1 } }
                );
                
                if (questionCategoryUpdate.modifiedCount == 0) {
                    return res.status(500).json({ message: "Question category not updated", success: false, });
                }
            }

            return res.status(200).json({ message: "Question deleted", success: false, });
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
            console.error("[Category Creation Error]:", error.message)
            if (error.code === 11000) {  // MongoDB duplicate key error code
                return res.status(409).json({ success: false, message: "Category already exists." });
            }
            next(error)
        }
    },

    getCategorys: async (req, res, next) => {
        try {
            const categorys = await Category.find().lean();
            console.log(categorys)
            return res.status(200).json({ message: "Category Sended", success: true, data: categorys });
        } catch (error) {
            console.error('[Category Query Error]', error.message);
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const categoryId = req.params.category_id;
            
            if (!categoryId) {
                return res.status(409).json({ message: "Bad request", success: false });
            }

            const result = await Category.findOneAndDelete({ _id: categoryId })
                        
            if (!result) {
                return res.status(409).json({ message: "Category not found", success: false });
            }

            const deletedQuestion = await Question.deleteMany({ category: result.categoryName });

            return res.status(200).json({ message: "Category deleted", success: true });

        } catch (error) {
            console.error('[Category delete Error]', error.message);
            next(error)
        }
    },

    getAllUsers: async(req, res, next) => {
        try {
            const users = await User.find().limit(10).lean();
            return res.status(200).json({ success: true, message: "users founded", data: users });
        } catch (error) {
            console.log('[User fetch all Error]', error.message);
            next(error)
        }
    }
}


export default AdminController
