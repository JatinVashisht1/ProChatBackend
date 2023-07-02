import { RequestHandler, Router } from "express";
import "../../../../di/provideDependencices";
import { CreateUserController } from "../controller/CreateUserController";
import { authMiddleware } from "../../../utils/jwtUtils";
import { SignInController } from "../controller/SignInUserController";
const router = Router();

router.post("/signup", new CreateUserController().createUserHandler);

router.post("/signin", new SignInController().signInHandler);

const reqhandler: RequestHandler = async (req, res, next) => {
  return res.status(200).json({ success: true });
};

router.get("/", authMiddleware, reqhandler);

export default router;
