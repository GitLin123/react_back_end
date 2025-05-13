// services/aigcService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export default class AigcService {
    static async generateImage(prompt) {
        try {
            const response = await axios.post(
                'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
                {
                    model: "wanx2.1-t2i-turbo",
                    input: { prompt },
                    parameters: {
                        size: "1024*1024", // 修正格式
                        n: 1
                    }
                },
                {
                    headers: {
                        'X-DashScope-Async': 'enable',
                        'Authorization': `Bearer sk-299a06ea63a240db9ffe1464f855b22d`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
        }
    }


}