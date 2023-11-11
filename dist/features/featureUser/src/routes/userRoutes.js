import { Router } from "express";
import '../../../../di/provideDependencices.js';
import { CreateUserController } from '../controller/CreateUserController.js';
import { SignInController } from '../controller/SignInUserController.js';
import { authMiddleware } from '../../../common/utils/jwtUtils.js';
import { SearchUserController } from '../controller/SearchUserController.js';
import { GetUserProfileController } from '../controller/GetUserProfileController.js';
const router = Router();
router.post("/signup", new CreateUserController().createUserHandler);
router.post("/signin", new SignInController().signInHandler);
router.get("/", authMiddleware, (req, res) => {
    return res.status(200).json({ success: true });
});
router.get("/searchUser", authMiddleware, new SearchUserController().searchUserHandler);
router.get("/userprofile", authMiddleware, new GetUserProfileController().getUserProfileRequestHandler);
export default router;
