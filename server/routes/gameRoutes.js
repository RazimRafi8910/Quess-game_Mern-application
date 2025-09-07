import express from 'express';
import verifyUser from '../middleware/verifyUser.js';
import { createGame,getGameRooms,checkGamePassword,getCategorys } from '../controller/gameController.js';


const router = express();


router.get('/rooms', verifyUser, getGameRooms);
router.get('/categorys', verifyUser, getCategorys);
router.post('/create', verifyUser, createGame);

router.post('/password', verifyUser, checkGamePassword);

export default router;