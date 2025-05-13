import express from 'express';
const UploadRouter = express.Router();
import UploadController from "../controllers/upload.controller.js";
UploadRouter.post('/file', UploadController.middleware,UploadController.controller.upload);

export default UploadRouter;