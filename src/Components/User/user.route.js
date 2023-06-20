import {Router} from 'express';
import {Register, login, emailConfirmation, updateInfo, resetPassword, confirmResetCode, changePasswordAfterConfirm} from './user.service.js';
import upLoadImg from '../../Utils/UploadImg.js';
import { Authentication } from './user.service.js';



const router = Router();



router.post("/register",upLoadImg("profilePicture"), Register);
router.post("/login", login);
router.patch("/emailConfirmation/:token", emailConfirmation);
router.put("/updateInfo/:id",Authentication, updateInfo);
router.post("/resetPassword", resetPassword);
router.post("/confirmResetCode/:token", confirmResetCode);
router.post("/changePasswordAfterConfirm/:token", changePasswordAfterConfirm);



export default router;