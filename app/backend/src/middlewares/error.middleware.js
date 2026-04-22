import multer from "multer";

export const errorMiddleware = (err, req, res, next) => {
    // Multer errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Custom errors (ApiError)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Generic errors
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};