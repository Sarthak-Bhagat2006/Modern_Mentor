import express from "express";
const router = express.Router();
import { isLoggedIn, isAdmin, isMember } from '../middleware.js';
import * as messageController from '../controllers/messages.controller.js';


router.get("/member/:groupId", isLoggedIn, messageController.getMemberForSidebar);
router.get("/chats/:id", isLoggedIn, messageController.getMessagesController);

router.post("/send/:id", isLoggedIn, messageController.sendMessageController)

export default router;