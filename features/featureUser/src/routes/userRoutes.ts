import { Router } from "express";
import "../../../../di/provideDependencices";
import { CreateUserController } from "../controller/CreateUserController";
import { SignInController } from "../controller/SignInUserController";
import { authMiddleware } from "../../../common/utils/jwtUtils";
import { SearchUserController } from "../controller/SearchUserController";
import { GetUserProfileController } from "../controller/GetUserProfileController";
import { UpdateFirebaseTokenController } from "../controller/UpdateFirebaseTokenController";
const router = Router();

router.post("/signup", new CreateUserController().createUserHandler);

router.post("/signin", new SignInController().signInHandler);

router.get("/", authMiddleware, (req, res) => {
  return res.status(200).json({ success: true });
});

router.get("/searchuser/:queryUser", authMiddleware, new SearchUserController().searchUserHandler);

router.get("/userprofile", authMiddleware, new GetUserProfileController().getUserProfileRequestHandler);

router.post("/updatefirebasetoken", authMiddleware, new UpdateFirebaseTokenController().updateFirebaseTokenRequestHandler);

export default router;
