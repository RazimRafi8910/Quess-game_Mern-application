import crypto from 'crypto';

export function generateGameID() {
    return crypto.randomBytes(4).toString('hex'); // 4 bytes = 8 hex characters
}


export function generateQuestionID() {
    return crypto.randomBytes(8).toString('hex');
}
