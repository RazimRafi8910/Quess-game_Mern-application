import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyUser from "../middleware/verifyUser.js";
import AdminController from "../controller/adminController.js";

const router = express();

router.get('/', verifyUser, verifyAdmin);

//question routes
router.get('/question', verifyUser, verifyAdmin, AdminController.getQuestions);
router.post('/question/create', verifyUser, verifyAdmin, AdminController.createQuestion);
router.delete('/question/:question_id/delete', verifyUser, verifyAdmin, AdminController.deleteQuestion);

//category routes
router.get('/category', verifyUser, verifyAdmin, AdminController.getCategorys);
router.post('/category/create', verifyUser, verifyAdmin, AdminController.createCategory);
router.delete('/category/:category_id/delete', verifyUser, verifyAdmin, AdminController.deleteCategory);

//user routes
router.get('/user', verifyUser, verifyAdmin, AdminController.getAllUsers);


export default router;