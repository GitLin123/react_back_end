import { ApiResponse } from '../utils/response.util.js';
import { handleError } from '../utils/response.util.js';
import OSSService from '../services/oss.services.js';
import {singleUpload} from "../middlewares/upload.middleware.js";
class UploadController {

    /**
     * 文件上传中间件
     * 必须先经过这个中间件处理才能访问req.file
     */
    static uploadMiddleware() {
        return singleUpload;
    }


    /**
     * 上传文件
     */
    async upload(req, res) {
        try {
            const {id,file} = req.body
            const result = await OSSService.uploadFromUrl(id,file);
            return res.status(200).json(ApiResponse.success(result));
        } catch (err) {
            return handleError(err, res);
        }
    }

    /**
     * 获取前端直传凭证
     */
    async getUploadToken(req, res) {
        try {
            const { filename, mimeType } = req.body;
            const token = await OSSService.generateUploadToken({ filename, mimeType });
            return res.status(200).json(ApiResponse.success(token));
        } catch (err) {
            return handleError(err, res);
        }
    }
}

// 导出控制器实例和中间件
export default {
    controller: new UploadController(),
    middleware: UploadController.uploadMiddleware()
};