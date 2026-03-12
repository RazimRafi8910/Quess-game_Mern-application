import express from 'express';
import verifyUser from '../middleware/verifyUser.js';
import { createGame, getGameRooms, checkGamePassword, getCategorys, getGameDetails } from '../controller/gameController.js';


const router = express();


router.get('/rooms', verifyUser, getGameRooms);
router.get('/search/:game_id', verifyUser, getGameDetails);
router.get('/categorys', verifyUser, getCategorys);
router.post('/create', verifyUser, createGame);
router.post('/password', verifyUser, checkGamePassword);

export default router;