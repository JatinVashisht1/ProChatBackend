import { Router } from "express";
import { authMiddleware } from '../../../common/utils/jwtUtils.js';
import { GetChatMessagesBetween2UsernamesController } from '../Controllers/GetChatBetween2UsersController.js';
const router = Router();
router.get("/getuserschat", authMiddleware, new GetChatMessagesBetween2UsernamesController().getChatMessagesBetween2UsernamesRequestHandler);
export const chatRouter = router;
