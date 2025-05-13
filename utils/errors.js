export class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class BusinessError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'BusinessError';
        this.statusCode = statusCode;
    }
}