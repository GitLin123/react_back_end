// validators/user.validator.js
import { body } from 'express-validator';

// 通用验证规则
const nameRule = body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('姓名长度必须在2-50个字符之间');

const emailRule = body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('请输入有效的邮箱地址')

const phoneRule = body('phone')
    .optional()
    .trim()
    .isMobilePhone('zh-CN')
    .withMessage('请输入有效的手机号码');

const avatarRule = body('avatar')
    .optional()
    .isURL()
    .withMessage('头像必须是有效的URL地址')
    .matches(/\.(jpeg|jpg|png|webp)$/i)
    .withMessage('只支持JPEG、PNG或WebP格式的图片');

const addressRule = body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('地址不能超过200个字符');

// 更新用户资料的验证规则
exports.validateUpdateUser = [
    nameRule,
    emailRule,
    phoneRule,
    avatarRule,
    addressRule,
    (req, res, next) => {
        // 检查至少有一个字段被更新
        const { full_name, email, phone, avatar, address } = req.body;
        if (!full_name && !email && !phone && !avatar && !address) {
            return res.status(400).json({
                error: '至少提供一个需要更新的字段'
            });
        }
        next();
    }
];