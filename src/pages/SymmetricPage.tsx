import React, { useState } from 'react';
import { encryptAES, decryptAES } from '../lib/aes';
import AESAnimation from '../components/AesDemo'; // Import the AESAnimation component
import { AlgorithmContent } from '../components/AlgorithmContent';
import { Lock, Unlock, Play, Pause, SkipForward, Key } from 'lucide-react';

export function SymmetricPage() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [keySize, setKeySize] = useState(128);
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleEncrypt = () => {
    try {
      setError('');
      if (key.length !== keySize / 8) {
        throw new Error(`Key must be exactly ${keySize / 8} characters (${keySize} bits)`);
      }
      const keyWithSize = key; // Use exact key length
      const encryptedText = encryptAES(input, keyWithSize);
      setEncrypted(encryptedText);
    } catch (err) {
      const requiredLength = keySize / 8;
      setError(`Key must be exactly ${requiredLength} characters (${keySize} bits)`);
      setEncrypted('');
    }
  };

  const handleDecrypt = () => {
    try {
      setError('');
      if (key.length !== keySize / 8) {
        throw new Error(`Key must be exactly ${keySize / 8} characters (${keySize} bits)`);
      }
      const keyWithSize = key; // Use exact key length
      const decryptedText = decryptAES(encrypted, keyWithSize);
      setDecrypted(decryptedText);
    } catch (err) {
      const requiredLength = keySize / 8;
      setError(`Key must be exactly ${requiredLength} characters (${keySize} bits)`);
      setDecrypted('');
    }
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="AES (Advanced Encryption Standard)"
        description="AES is a symmetric block cipher chosen by the U.S. government to protect classified information. It is implemented in software and hardware throughout the world to encrypt sensitive data."
        complexity="O(n) for encryption and decryption"
        security="AES-256 is considered quantum-resistant and has no known practical attacks"
        applications={[
          "Secure communication channels",
          "File encryption",
          "Password managers",
          "VPN services",
          "Disk encryption"
        ]}
        steps={[
          {
            title: "Key Expansion",
            description: "The AES key schedule expands the initial key into separate round keys.",
            code: `const expandKey = (key) => {
  // Key schedule implementation
  const w = new Array(44);
  for (let i = 0; i < 4; i++) {
    w[i] = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
  }
  // ... rest of implementation
};`
          },
          {
            title: "Initial Round",
            description: "Add round key to the input state.",
            code: `const addRoundKey = (state, roundKey) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] ^= roundKey[i][j];
    }
  }
};`
          },
          {
            title: "Main Rounds",
            description: "Each main round consists of SubBytes, ShiftRows, MixColumns, and AddRoundKey operations.",
            code: `const mainRound = (state, roundKey) => {
  subBytes(state);
  shiftRows(state);
  mixColumns(state);
  addRoundKey(state, roundKey);
};`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive AES Demonstration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Key Size (bits)</label>
              <select
                value={keySize}
                onChange={(e) => setKeySize(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value={128}>128</option>
                <option value={192}>192</option>
                <option value={256}>256</option>
              </select>
            </div>
            <label className="block text-sm font-medium mb-1">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-20"
              placeholder="Enter text to encrypt"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Encryption Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter encryption key"
                />
              </div>
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
                <Unlock className="w-4 h-4" />
                <span>Decrypt</span>
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Encrypted Text</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono min-h-[3rem]">
                {encrypted}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Decrypted Text</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 min-h-[3rem]">
                {decrypted}
              </div>
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
              <AESAnimation message={input} key={key} isDecryption={false} /> {/* Integrate the AESAnimation component */}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">AES Round Structure</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80"
            alt="AES Round Structure"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Detailed view of an AES round showing SubBytes, ShiftRows, MixColumns, and AddRoundKey operations.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Key Schedule</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461278-49b5d0c87c95?auto=format&fit=crop&w=800&q=80"
            alt="AES Key Schedule"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Visualization of the AES key schedule showing how round keys are generated from the initial key.
          </p>
        </div>
      </div>
    </div>
  );
}
