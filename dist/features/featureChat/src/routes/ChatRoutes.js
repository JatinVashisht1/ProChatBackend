import { Router } from "express";
import { authMiddleware } from '../../../common/utils/jwtUtils.js';
import { GetChatMessagesBetween2Usernames } from '../Controllers/GetChatBetween2UsersController.js';
const router = Router();
router.get("/getChatBetweenTwoUsers", authMiddleware, new GetChatMessagesBetween2Usernames().getChatMessagesBetween2UsernamesRequestHandler);
export const chatRouter = router;
