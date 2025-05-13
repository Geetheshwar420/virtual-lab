import { MD5 } from 'crypto-js';

export function md5Input(input) {
    if (!input) {
        throw new Error('Please enter something to hash.');
    }
    const hash = MD5(input).toString();
    return hash;
}
