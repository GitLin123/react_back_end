// user.controller.js
import { UserService } from "../services/user.service.js";
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError, AuthError } from '../utils/errors.js';

//注册添加用户
export const signUser = async (req, res) => {
    try {
        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: '请求体缺少必要字段' });
        }
        const { username, email, password } = req.body;
        // 调用服务层注册用户
        const newUser = await UserService.signUser(username, email, password);

        // 返回新用户数据（排除密码）
        const { password: _, ...userData } = newUser;
        res.status(201).json(userData);

    } catch (err) {
        if (err.message === '用户名或邮箱已存在') {
            res.status(409).json({ error: err.message });
        } else {
            console.error('注册失败:', err);
            res.status(500).json({ error: '服务器内部错误' });
        }
    }
};



// 获取所有用户
export const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "无法获取用户列表" });
    }
};

// 根据ID获取用户
export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserService.getUserByID(id);
        res.status(200).json(user);
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "服务器内部错误" });
        }
    }
};

// 根据username获取用户
export const getUserByName = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await UserService.getUserByName(username);
        res.status(200).json(user);
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "服务器内部错误" });
        }
    }
};


// 创建用户（示例占位）
export const createUser = (req, res) => {
    // 实现代码...
};

//由ID删除用户
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        // 调用服务层删除用户
        await UserService.deleteUser(id);
        // 成功响应（204 No Content）
        res.status(204).send();
    } catch (err) {
        // 根据错误类型返回不同状态码
        if (err instanceof NotFoundError) {
            res.status(404).json({ error: '用户不存在' });
        } else if (err.message === '无效的用户 ID') {
            res.status(400).json({ error: '用户 ID 必须是数字' });
        } else {
            console.error('删除用户失败:', err);
            res.status(500).json({ error: '服务器内部错误' });
        }
    }
};


//用户登录

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 输入验证（建议使用express-validator中间件）
        if (!username || !password) {
            return res.status(400).json({ error: '需要提供登录凭证和密码' });
        }

        // 调用服务层
        const { token, user } = await UserService.loginUser(username, password);

        // 成功响应
        res.status(200).json({
            token,
            user,
            expiresIn: 604800 // 7天
        });

    } catch (error) {
        // 错误分类处理
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: "账号或密码含有非法字符" });
        }
        if (error instanceof AuthError) {
            return res.status(401).json({ error: '账号或密码错误' });
        }

        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};