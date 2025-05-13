import jwt from "jsonwebtoken";
import {UserRepository} from "../repositories/user.repository.js";

export default class AuthService {
    static #secret = 'picture'; // 类私有属性存储密钥

    /**
     * 解析 Token 中的用户信息（包含自动验证）
     * @param {string} token - JWT Token
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    static async parseUserFromToken(token) {
        try {
            const validation = await this.validateToken(token);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error || "Token 解析失败"
                };
            }

            // 2. 提取标准声明
            const { decoded } = validation;
            const user = await UserRepository.getUserById(decoded.userId);
            return {
                success: true,
                user: {...user}
            };
        } catch (error) {
            return {
                success: false,
                error: `用户信息解析失败: ${error.message}`
            };
        }
    }

    /**
     * 验证 JWT Token 有效性（原方法优化）
     * @param {string} token - JWT Token
     * @returns {Promise<{valid: boolean, decoded?: object, error?: string}>}
     */
    static async validateToken(token) {
        if (!token) {
            return { valid: false, error: "未提供 Token" };
        }

        try {
            const decoded = await jwt.verify(token, this.#secret);
            return { valid: true, decoded };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return { valid: false, error: "Token 已过期" };
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return { valid: false, error: "无效 Token" };
            }
            return { valid: false, error: error.message || "Token 验证失败" };
        }
    }
}
