export class ApiResponse {
    constructor(code, message, data = null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success(data = null, message = 'Success') {
        return new ApiResponse(200, message, data);
    }

    static created(data = null, message = 'Created') {
        return new ApiResponse(201, message, data);
    }
}

export const handleError = (err, res) => {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;

    if (statusCode === 500) {
        console.error(err);
    }

    return res.status(statusCode).json({
        code: statusCode,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};