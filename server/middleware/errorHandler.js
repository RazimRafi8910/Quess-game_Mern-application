export default function errorHandler(error, req, res, next) {
    //devolopment code
    console.log(error);
    
    const statusCode = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
}