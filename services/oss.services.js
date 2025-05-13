import OSSClient from '../utils/oss.util.js';
import { BusinessError, ValidationError } from '../utils/errors.js';
import config from '../config/oss.config.js';
import { UserService } from "./user.service.js";
import axios from 'axios';

class OSSService {
    /**
     * 上传文件到OSS
     * @param {string} userId - 用户ID
     * @param {Object} file - 文件对象(包含path, originalname等属性)
     * @param {string} [prefix='uploads'] - 存储前缀
     * @returns {Promise<Object>} 上传结果
     */
    async uploadFile(userId, file, prefix = 'uploads') {
        this.validateFile(file);

        const objectKey = `${prefix}/${userId}/${Date.now()}-${file.originalname}`;
        const result = await OSSClient.putObject(objectKey, file.path, {
            headers: {
                'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalname)}"`
            }
        });
        await UserService.addImage(userId, result.url);

        return {
            url: result.url,
            name: objectKey,
            size: file.size,
            mimeType: file.mimetype
        };
    }

    /**
     * 从URL下载图片并上传到OSS
     * @param {string} userId - 用户ID
     * @param {string} imageUrl - 图片URL
     * @param {string} [prefix='generated'] - 存储前缀
     * @returns {Promise<Object>} 上传结果
     */
    async uploadFromUrl(userId, imageUrl, prefix = 'generated') {
        try {
            // 1. 下载图片并验证
            const { buffer, mimeType } = await this.downloadAndValidateImage(imageUrl);

            // 2. 生成文件名和路径
            const ext = this.getExtensionFromMimeType(mimeType);
            const filename = `img-${Date.now()}.${ext}`;
            const objectKey = `${prefix}/${userId}/${filename}`;

            // 3. 上传到OSS
            const result = await OSSClient.putObject(objectKey, buffer, {
                headers: {
                    'Content-Type': mimeType,
                    'Content-Disposition': `inline; filename="${filename}"`
                }
            });

            // 4. 关联到用户
            await UserService.addImage(userId, result.url);

            return {
                url: result.url,
                name: objectKey,
                size: buffer.length,
                mimeType
            };

        } catch (error) {
            console.error('URL上传失败:', error);
            throw new BusinessError(`图片URL上传失败: ${error.message}`);
        }
    }

    /**
     * 下载图片并验证
     * @param {string} url - 图片URL
     * @returns {Promise<{buffer: Buffer, mimeType: string}>}
     */
    async downloadAndValidateImage(url) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            maxContentLength: config.policy.maxSize // 限制下载大小
        });

        const buffer = Buffer.from(response.data, 'binary');
        const mimeType = response.headers['content-type'];

        // 验证文件类型
        if (!config.policy.allowedMimeTypes.includes(mimeType)) {
            throw new ValidationError(`不支持的文件类型: ${mimeType}`);
        }

        // 验证文件大小
        if (buffer.length > config.policy.maxSize) {
            throw new ValidationError(`文件大小不能超过 ${config.policy.maxSize / 1024 / 1024}MB`);
        }

        return { buffer, mimeType };
    }

    /**
     * 根据MIME类型获取文件扩展名
     * @param {string} mimeType
     * @returns {string}
     */
    getExtensionFromMimeType(mimeType) {
        const map = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp'
        };
        return map[mimeType] || 'bin';
    }

    // ... 保留原有的generateUploadToken和validateFile方法
    /**
     * 生成前端直传凭证
     * @param {Object} params - 参数
     * @param {string} params.filename - 文件名
     * @param {string} params.mimeType - 文件类型
     * @param {string} [params.prefix='uploads'] - 存储前缀
     * @returns {Object} 上传凭证
     */
    generateUploadToken({ filename, mimeType, prefix = 'uploads' }) {
        if (!config.policy.allowedMimeTypes.includes(mimeType)) {
            throw new ValidationError(`不支持的文件类型: ${mimeType}`);
        }

        const objectKey = `${prefix}/${Date.now()}-${filename}`;
        const url = OSSClient.generatePresignedUrl(objectKey, {
            contentType: mimeType
        });

        return {
            url,
            method: 'PUT',
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`
            },
            objectKey
        };
    }

    /**
     * 验证文件是否符合要求
     * @param {Object} file - 文件对象
     */
    validateFile(file) {
        if (!file) {
            throw new ValidationError('没有上传文件');
        }

        if (file.size > config.policy.maxSize) {
            throw new ValidationError(`文件大小不能超过 ${config.policy.maxSize / 1024 / 1024}MB`);
        }

        if (!config.policy.allowedMimeTypes.includes(file.mimetype)) {
            throw new ValidationError(`不支持的文件类型: ${file.mimetype}`);
        }
    }
}

export default new OSSService();