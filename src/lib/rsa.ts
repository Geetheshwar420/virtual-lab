import forge from 'node-forge';

interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateRSAKeys = (): RSAKeyPair => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  
  return {
    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keypair.privateKey)
  };
};

export const encryptRSA = (plaintext: string, publicKey: string): string => {
  const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = publicKeyObj.encrypt(plaintext, 'RSA-OAEP');
  return forge.util.encode64(encrypted);
};

export const decryptRSA = (ciphertext: string, privateKey: string): string => {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
  const decrypted = privateKeyObj.decrypt(forge.util.decode64(ciphertext), 'RSA-OAEP');
  return decrypted;
};
