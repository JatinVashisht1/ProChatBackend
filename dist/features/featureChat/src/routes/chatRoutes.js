import { Router } from "express";
import { authMiddleware } from '../../../common/utils/jwtUtils.js';
import { GetChatMessagesBetween2UsernamesController } from '../Controllers/GetChatBetween2UsersController.js';
import { GetChatAccountsOfUserController } from '../Controllers/GetChatAccountsOfUserController.js';
const router = Router();
router.get("/getuserschat", authMiddleware, new GetChatMessagesBetween2UsernamesController()
    .getChatMessagesBetween2UsernamesRequestHandler);
router.get("/getuseraccounts", authMiddleware, new GetChatAccountsOfUserController().getChatAccountsOfUserRequestHandler);
export const chatRouter = router;
