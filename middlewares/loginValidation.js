import { body } from 'express-validator';

export const loginValidation = [
    body('username')
        .trim().notEmpty().withMessage('用户名不能为空')
        .isLength({ max: 50 }).withMessage('最长50个字符'),

    body('password')
        .trim().notEmpty().withMessage('密码不能为空')
        .isLength({ min: 6 }).withMessage('密码至少6位')
];