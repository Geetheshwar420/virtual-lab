import React, { useState } from 'react';
import { generateRSAKeys, encryptRSA, decryptRSA } from '../lib/rsa';
import { AlgorithmContent } from '../components/AlgorithmContent';
import { Key, Lock, Unlock, Play, Pause, SkipForward } from 'lucide-react';

export function AsymmetricPage() {
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerateKeys = () => {
    try {
      const { publicKey, privateKey } = generateRSAKeys();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
    } catch (err) {
      console.error('Error generating keys:', err);
    }
  };

  const handleEncrypt = () => {
    try {
      const encryptedMessage = encryptRSA(message, publicKey);
      setEncrypted(encryptedMessage);
    } catch (err) {
      console.error('Encryption error:', err);
      setEncrypted('Encryption failed');
    }
  };

  const handleDecrypt = () => {
    if (privateKey !== privateKey) {
      console.error('Invalid private key');
      setDecrypted('Decryption failed: Invalid private key');
      return;
    }

    try {
      const decryptedMessage = decryptRSA(encrypted, privateKey);
      setDecrypted(decryptedMessage);
    } catch (err) {
      console.error('Decryption error:', err);
      setDecrypted('Decryption failed');
    }
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="RSA (Rivest-Shamir-Adleman)"
        description="RSA is one of the first public-key cryptosystems and is widely used for secure data transmission. The encryption key is public and distinct from the decryption key which is kept secret (private)."
        complexity="Key generation: O(log n)³, Encryption/Decryption: O(log n)²"
        security="Security relies on the practical difficulty of factoring the product of two large prime numbers"
        applications={[
          "Digital signatures",
          "Secure email (PGP/GPG)",
          "SSL/TLS certificates",
          "Secure key exchange",
          "Document signing"
        ]}
        steps={[
          {
            title: "Key Generation",
            description: "Generate public and private key pairs using prime numbers.",
            code: `function generateKeyPair(bits) {
  // Generate two large prime numbers
  const p = generatePrime(bits/2);
  const q = generatePrime(bits/2);
  
  // Calculate n = p * q
  const n = p * q;
  
  // Calculate φ(n) = (p-1)(q-1)
  const phi = (p-1) * (q-1);
  
  // Choose public exponent e
  const e = 65537; // Common choice
  
  // Calculate private exponent d
  const d = modInverse(e, phi);
  
  return {
    public: { e, n },
    private: { d, n }
  };
}`
          },
          {
            title: "Encryption",
            description: "Encrypt message using the public key.",
            code: `function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  return modPow(message, e, n);
}`
          },
          {
            title: "Decryption",
            description: "Decrypt ciphertext using the private key.",
            code: `function decrypt(ciphertext, privateKey) {
  const { d, n } = privateKey;
  return modPow(ciphertext, d, n);
}`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive RSA Demonstration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <button
              onClick={handleGenerateKeys}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>Generate Key Pair</span>
            </button>

            <div>
              <div id="privateKeyInput" style={{ display: 'none' }}>
                <label className="block text-sm font-medium mb-1">Enter Private Key</label>
                <input
                  type="text"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your private key"
                />
              </div>
              <label className="block text-sm font-medium mb-1">Public Key</label>
              <input
                type="text"
                value={publicKey}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Private Key</label>
              <input
                type="text"
                value={privateKey}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-20"
                placeholder="Enter message to encrypt"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleEncrypt}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt</span>
              </button>
              <button
                onClick={handleDecrypt}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4" onClick={() => {
                  const input = document.getElementById('privateKeyInput');
                  if (input) {
                    input.style.display = 'block';
                  }
                }} />
                <span>Decrypt</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Encrypted Message</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono overflow-x-auto">
                {encrypted}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(encrypted)} 
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
              >
                Copy
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Decrypted Message</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                {decrypted}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(decrypted)} 
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="border-t md:border-l md:border-t-0 pt-6 md:pt-0 md:pl-6">
            <h3 className="text-lg font-semibold mb-4">Animation Controls</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Animation Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="relative h-64 border rounded-lg p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">RSA operation visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">RSA Key Generation</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461398-1c5c5a3a7b9e?auto=format&fit=crop&w=800&q=80"
            alt="RSA Key Generation Process"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Visualization of the RSA key generation process, showing how public and private
            keys are created using prime numbers.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">RSA Encryption/Decryption</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461442-e70f1a6c9f66?auto=format&fit=crop&w=800&q=80"
            alt="RSA Encryption/Decryption Flow"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Diagram showing the flow of data during RSA encryption and decryption operations.
          </p>
        </div>
      </div>
    </div>
  );
}
