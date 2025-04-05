// user.routes.js
import express from 'express';
import {
    getUsers,
    getUserById,
    getUserByName,
    deleteUser,
    signUser,
    loginUser
} from '../controllers/user.controller.js';
import { signValidation } from '../middlewares/signValidation.js';
import { loginValidation } from "../middlewares/loginValidation.js";
const router = express.Router();
router.post('/sign', ...signValidation, signUser); //注册用户（username，email，password）
router.get('/users', getUsers);        // 获取所有的用户
router.get('/users/:id', getUserById);  // 获取指定ID的用户
router.get('/:username', getUserByName); // 获取指定username的用户
router.delete('/delete/:id', deleteUser); //删除指定ID的用户
router.post('/login', ...loginValidation, loginUser);
export default router;