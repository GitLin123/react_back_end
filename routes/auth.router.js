import express from "express";
const AuthRouter = express.Router();
import { validationToken,
getInfoByToken

} from "../controllers/auth.controller.js";

//验证token是否有效接口
AuthRouter.get('/verify', validationToken);

//根据token返回用户信息接口
AuthRouter.get('/info', getInfoByToken)

export default AuthRouter;