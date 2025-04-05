import bodyParser  from "body-parser";
import morgan from 'morgan'
import cors from "cors";
import express from "express";

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
};


export default async ({ app }) => {
    app.enable('trust proxy');
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/status', (req, res) => res.status(200).end());
    app.head('/status', (req, res) => res.status(200).end());

    // 错误处理
    app.use(errorHandler);

    return app;
};