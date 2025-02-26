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
router.post('/category/create', verifyUser, verifyAdmin, AdminController.createCategory);
router.get('/category', verifyUser, verifyAdmin, AdminController.getCategorys);
router.delete('/category/:category_id/delete', verifyUser, verifyAdmin, AdminController.deleteCategory);


export default router;