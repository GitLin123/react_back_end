import multer from 'multer';
import path from 'path';
import { BusinessError } from '../utils/errors.js';
import config from '../config/oss.config.js';

// 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 确保这个目录存在
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    if (config.policy.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BusinessError(`不支持的文件类型: ${file.mimetype}`, 400));
    }
};

// 创建上传中间件
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.policy.maxSize,
        files: 1 // 每次只允许上传一个文件
    }
});

// 导出单个文件上传中间件
export const singleUpload = upload.single('file'); // 'file'必须与前端字段名一致

// 默认导出
export default upload;