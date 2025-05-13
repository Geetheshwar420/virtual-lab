import CryptoJS from 'crypto-js';

export const encryptDES = (plaintext: string, key: string): string => {
    const keySize = key.length;
    if (keySize !== 8) {
        throw new Error('Key must be exactly 8 characters (64 bits)');
    }

    const encrypted = CryptoJS.DES.encrypt(plaintext, key).toString();
    return encrypted;
};

export const decryptDES = (ciphertext: string, key: string): string => {
    const keySize = key.length;
    if (keySize !== 8) {
        throw new Error('Key must be exactly 8 characters (64 bits)');
    }

    const bytes = CryptoJS.DES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
};
