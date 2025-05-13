import { encryptAES, decryptAES } from './aes';

const key = 'mysecretkey1234'; // 16-byte key
const message = 'Hello, World!'; // Message to encrypt

const encrypted = encryptAES(message, key);
console.log('Encrypted:', encrypted);

const decrypted = decryptAES(encrypted, key);
console.log('Decrypted:', decrypted);

if (decrypted.trim() === message) {
  console.log('Test passed: Decrypted message matches the original message.');
} else {
  console.log('Test failed: Decrypted message does not match the original message.');
}