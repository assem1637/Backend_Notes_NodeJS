import {Router} from 'express';
import {Register, login, emailConfirmation, updateInfo, resetPassword, confirmResetCode, changePasswordAfterConfirm} from './user.service.js';





const router = Router();



router.post("/register", Register);
router.post("/login", login);
router.patch("/emailConfirmation/:token", emailConfirmation);
router.put("/updateInfo/:id", updateInfo);
router.post("/resetPassword", resetPassword);
router.post("/confirmResetCode/:token", confirmResetCode);
router.post("/changePasswordAfterConfirm/:token", changePasswordAfterConfirm);



export default router;