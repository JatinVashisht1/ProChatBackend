import { Router } from "express";
import { authMiddleware } from "../../../common/utils/jwtUtils";
import { GetChatMessagesBetween2UsernamesController } from "../Controllers/GetChatBetween2UsersController";
import { GetChatAccountsOfUserController } from "../Controllers/GetChatAccountsOfUserController";

const router = Router();

router.get(
  "/getuserschat",
  authMiddleware,
  new GetChatMessagesBetween2UsernamesController()
    .getChatMessagesBetween2UsernamesRequestHandler
);

router.get(
  "/getuseraccounts",
  authMiddleware,
  new GetChatAccountsOfUserController().getChatAccountsOfUserRequestHandler
);

export const chatRouter = router;
