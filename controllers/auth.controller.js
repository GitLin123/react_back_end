import AuthService from "../services/auth.service.js";

/**
 * Token 验证控制器
 * 使用场景：需要身份验证的接口中间件
 */
export const validationToken = async (req, res) => {
    try {
        // 1. 从 Header 获取 Token (Bearer Token 格式)
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1]; // 提取 Bearer 后的 Token

        // 2. 检查 Token 是否存在
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "身份验证失败",
                error: "未提供访问令牌"
            });
        }

        // 3. 调用服务层验证 Token
        const { valid, decoded, error } = await AuthService.validateToken(token);

        // 4. 处理无效 Token 的情况
        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "身份验证失败",
                error: error || "无效访问令牌"
            });
        }

        // 5. 验证通过后的处理
        res.status(200).json({
            success: true,
            message: "身份验证成功",
            user: decoded
        });

    } catch (error) {
        // 6. 处理意外错误
        console.error("[Auth Controller Error]", error);
        res.status(500).json({
            success: false,
            message: "服务器错误",
            error: error.message || "身份验证过程中发生未知错误"
        });
    }
};


export const getInfoByToken = async (req, res) => {
    try {
        // 1. 从 Header 获取 Token (Bearer Token 格式)
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1]; // 提取 Bearer 后的 Token
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "身份验证失败",
                error: "未提供访问令牌"
            });
        }
        const { user } = await AuthService.parseUserFromToken(token);
        return res.status(200).json({
            success: true,
            user: user
        })
    }catch(err) {


    }
}