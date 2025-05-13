import { SHA256 } from 'crypto-js';


export function hashInput(input) {
    if (!input) {
        throw new Error('Please enter something to hash.');
    }
    const hash = SHA256(input).toString();

    return hash;
}
