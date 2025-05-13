import OSS from 'ali-oss';
import config from '../config/oss.config.js';
import { BusinessError } from './errors.js';

class OSSClient {
    constructor() {
        this.client = new OSS(config);
    }

    /**
     * 普通文件上传
     * @param {string} objectKey - OSS对象键
     * @param {string|Buffer} file - 文件路径或Buffer
     * @param {Object} [options] - 上传选项
     * @returns {Promise<OSS.PutObjectResult>}
     */
    async putObject(objectKey, file, options = {}) {
        try {
            return await this.client.put(objectKey, file, options);
        } catch (err) {
            throw new BusinessError(`OSS上传失败: ${err.message}`, 500);
        }
    }

    /**
     * 生成前端直传签名URL
     * @param {string} objectKey - OSS对象键
     * @param {Object} [options] - 选项
     * @param {number} [options.expires=3600] - URL有效期(秒)
     * @param {string} [options.contentType] - 内容类型
     * @returns {string} 签名URL
     */
    generatePresignedUrl(objectKey, { expires = 3600, contentType } = {}) {
        try {
            return this.client.signatureUrl(objectKey, {
                expires,
                method: 'PUT',
                'Content-Type': contentType || 'application/octet-stream'
            });
        } catch (err) {
            throw new BusinessError(`生成签名URL失败: ${err.message}`, 500);
        }
    }

    /**
     * 分片上传
     * @param {string} objectKey - OSS对象键
     * @param {string} filePath - 文件路径
     * @param {Object} [options] - 上传选项
     * @returns {Promise<OSS.MultipartUploadResult>}
     */
    async multipartUpload(objectKey, filePath, options = {}) {
        const defaultOptions = {
            progress: (p) => console.log(`上传进度: ${(p * 100).toFixed(2)}%`),
            partSize: 1024 * 1024, // 1MB
            parallel: 4,
            ...options
        };

        try {
            return await this.client.multipartUpload(objectKey, filePath, defaultOptions);
        } catch (err) {
            throw new BusinessError(`分片上传失败: ${err.message}`, 500);
        }
    }
}

export default new OSSClient();