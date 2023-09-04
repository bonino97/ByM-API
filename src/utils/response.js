const sendResponse = (res, statusCode, msg = '', data = {}) => {
    const isSuccessStatusCode = statusCode >= 200 && statusCode < 300;

    // If there's no message and the code isn't successful, try to extract the message from a known error
    if (!msg && !isSuccessStatusCode) {
        msg = isKnownError(data) ? data.message : 'An error occurred';
        console.error(msg, data);
    }

    res.status(statusCode).json({
        success: isSuccessStatusCode,
        msg,
        data: isSuccessStatusCode ? data : {},
    });
};

const isKnownError = (error) => {
    return error && error.message !== undefined;
};


module.exports = {
    sendResponse
}