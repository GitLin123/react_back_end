import express from "express";
import router from "./index.js";
const AigcRouter = express.Router();
import {createImage} from "../controllers/aigc.picture.js";

// 图像生成接口
AigcRouter.post('/generate',createImage);

export default AigcRouter;