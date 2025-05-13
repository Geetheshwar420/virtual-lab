import { MD5 } from 'crypto-js';

/**
 * Function to hash a message using MD5
 * @param message - The message to be hashed
 * @returns The MD5 hash of the message
 */
export function hashMessage(message: string): string {
    if (!message || typeof message !== 'string' || message.trim() === '') {
        throw new Error('Please enter a valid message to hash.');
    }
    return MD5(message).toString();
}