import UserRouter from './user.router.js'
import AuthRoute from './auth.router.js'
import AigcRouter from "./aigc.router.js";
import UploadRouter from "./upload.router.js";
import express from "express";
const router = express.Router();

router.use('/user', UserRouter);
router.use('/token', AuthRoute);
router.use('/ai', AigcRouter);
router.use('/upload', UploadRouter);
export default router;