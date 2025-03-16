import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { get } from 'mongoose';
import { getMessages, getUsers, sendMessage } from '../controllers/message.controller.js';
const router = express.Router();


router.get('/users',protectRoute,getUsers);
router.get("/:id",protectRoute,getMessages);
router.post("/:id",protectRoute,sendMessage);

export default router;