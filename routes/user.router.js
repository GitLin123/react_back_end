// user.routes.js
import express from 'express';
import {
    getUsers,
    getUserById,
    getUserByName,
    deleteUser,
    signUser,
    loginUser,
    getUserImages,
    addImage,
} from '../controllers/user.controller.js';
import { signValidation } from '../middlewares/signValidation.js';
import { loginValidation } from "../middlewares/loginValidation.js";
const UserRouter = express.Router();
UserRouter.post('/sign', ...signValidation, signUser); //注册用户（username，email，password）
UserRouter.get('/', getUsers);        // 获取所有的用户
UserRouter.get('/:id', getUserById);  // 获取指定ID的用户
UserRouter.get('/name/:username', getUserByName); // 获取指定username的用户
UserRouter.delete('/delete/:id', deleteUser); //删除指定ID的用户
UserRouter.post('/login', ...loginValidation, loginUser);
UserRouter.get('/images/:id',getUserImages);//获取用户图库
UserRouter.post('/add_image',addImage);//添加用户图片
export default UserRouter;