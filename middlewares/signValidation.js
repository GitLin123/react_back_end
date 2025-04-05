import { body } from 'express-validator';
/**
 * 注册的字段验证中间件
 *
 * */
export const signValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('用户名不能为空')
        .isLength({ min: 3 }).withMessage('用户名至少3个字符'),

    body('email')
        .trim()
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式无效'),

    body('password')
        .notEmpty().withMessage('密码不能为空')
        .isLength({ min: 6 }).withMessage('密码至少6个字符')
];