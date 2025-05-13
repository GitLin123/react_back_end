// controllers/aigcController.js
import AigcService  from '../services/aigc.picture.js';
import axios from "axios";

export const  createImage = async (req, res) => {
    try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: '提示词不能为空' });
            }

            const response = await AigcService.generateImage(prompt);
            const inte =  setInterval(async () => {
            try {
                const result = await axios.get(
                    `https://dashscope.aliyuncs.com/api/v1/tasks/${response.output.task_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer sk-299a06ea63a240db9ffe1464f855b22d`,
                            'Content-Type': 'application/json'
                        }
                    },
                    {
                        timeout: 15000
                    },
                );

                if (result.data.output.task_status === 'SUCCEEDED') {
                    clearInterval(inte);
                    res.status(200).json(result.data);
                }
            } catch (error) {
                clearInterval(inte);
                console.error('查询失败:', error);
            }
        }, 3000);
        } catch (err) {
        }
    }
