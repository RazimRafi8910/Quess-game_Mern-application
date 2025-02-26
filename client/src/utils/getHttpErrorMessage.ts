
export default function getHttpErrorMessage(statusCode: number): string {
    const errorMessageStack : { [key : number]: string} = {
        400: "Bad Request, please Try again",
        404: "Invalid URL",
        500: "Internal server Error",
        401: "Unauthorized, please Login!",
        403: "Forbidden",
        502: "Bad Gateway",
    }
    if (statusCode in errorMessageStack) {
        return errorMessageStack[statusCode];
    }
    return `HTTP Error ${statusCode}`
}