import { Router } from "express";
import { authMiddleware } from "../../../common/utils/jwtUtils";
import { GetChatMessagesBetween2UsernamesController } from "../Controllers/GetChatBetween2UsersController";
import { GetChatAccountsOfUserController } from "../Controllers/GetChatAccountsOfUserController";
import { GetChatBetween2UsersPaginatedController } from "../Controllers/GetChatBetween2UsersPaginatedController";
import { DeleteChatMessageController } from "../Controllers/DeleteChatMessageController";

const router = Router();

router.get(
  "/getuserschat/:anotherUsername",
  authMiddleware,
  new GetChatMessagesBetween2UsernamesController()
    .getChatMessagesBetween2UsernamesRequestHandler
);

router.get(
  "/getuseraccounts",
  authMiddleware,
  new GetChatAccountsOfUserController().getChatAccountsOfUserRequestHandler
);

router.get(
  "/getuserchatpaginated/:anotherusername/:startFrom?",
  new GetChatBetween2UsersPaginatedController().getChatBetween2UsersPaginatedHandler
);

router.delete(
  "/deletechatmessage",
  new DeleteChatMessageController().deleteChatMessageRequestHandler
);

export const chatRouter = router;
