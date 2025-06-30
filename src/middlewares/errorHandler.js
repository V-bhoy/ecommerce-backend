export function errorHandler(err, req, res, next){
    console.log(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // Optionally: add stack trace only in development
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
}