// user.service.js
import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundError } from '../errors/NotFoundError.js';
import jwt from "jsonwebtoken";
import { AuthError } from '../utils/errors.js';

export class UserService {

    static async signUser(username, email, password) {
        // 检查用户名和邮箱是否已存在
        const existingUser = await UserRepository.getUserByName(username);
        if (existingUser) {
            throw new Error('用户名已存在');
        }

        // // 哈希密码
        // const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        return await UserRepository.createUser(username, email, password);
    }


    // 获取所有用户
    static async getUsers() {
        try {
            return await UserRepository.getAllUsers();
        } catch (err) {
            throw new Error('获取用户列表失败');
        }
    }

    // 根据ID获取用户
    static async getUserByID(id) {
        // 参数校验
        if (isNaN(id)) {
            throw new Error('用户 ID 必须是数字');
        }
        try {
            const user = await UserRepository.getUserById(id);
            if (!user) {
                throw new NotFoundError('用户不存在');
            }
            return user;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            throw new Error('获取用户信息失败');
        }
    }

    // 根据username获取用户信息
    static async getUserByName(username) {
        try {
            const user = await UserRepository.getUserByName(username);
            if (!user) {
                throw new NotFoundError('用户不存在');
            }
            return user;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            throw new Error('获取用户信息失败');
        }
    }

    //删除用户
    static async deleteUser(id) {
        // 参数校验
        if (isNaN(id)) {
            throw new Error('无效的用户 ID');
        }
        // 检查用户是否存在
        const user = await UserRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError('用户不存在');
        }
        // 执行删除
        await UserRepository.deleteUser(id);
    }



    //用户登录
    static async loginUser(username, password) {
        try {
            // 1. 获取用户（支持用户名/邮箱登录）
            const user = await UserRepository.getUserForLogin(username);

            if (!user) {
                throw new AuthError('用户不存在');
            }
            // 2. 验证密码
            if(user.password !== password) {
                throw new AuthError('密码错误');
            }

            await UserRepository.updateLastLogin(user.id);

            // 3. 生成JWT（使用环境变量）
            const token = jwt.sign(
                { userId: user.id },
                'picture',
                { expiresIn: '7d' }
            );

            // 4. 移除敏感信息
            delete user.password;
            return { token, user };

        } catch (error) {
            // 向上抛出已知错误
            if (error instanceof AuthError) throw error;
            // 包装未知错
            throw new Error('登录过程发生异常');
        }
    }



}