import { Router } from "express";
import "../../../../di/provideDependencices";
import { CreateUserController } from "../controller/CreateUserController";
import { SignInController } from "../controller/SignInUserController";
import { authMiddleware } from "../../../common/utils/jwtUtils";
import { SearchUserController } from "../controller/SearchUserController";
const router = Router();

router.post("/signup", new CreateUserController().createUserHandler);

router.post("/signin", new SignInController().signInHandler);

router.get("/", authMiddleware, (req, res) => {
  return res.status(200).json({ success: true });
});

router.get("/searchUser", authMiddleware, new SearchUserController().searchUserHandler);

export default router;
