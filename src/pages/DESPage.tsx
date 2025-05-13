import React, { useState } from 'react';
import { encryptDES, decryptDES } from '../lib/des';
import { AlgorithmContent } from '../components/AlgorithmContent';
import { Lock, Unlock, Play, Pause, SkipForward } from 'lucide-react';

export function DESPage() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleEncrypt = () => {
    try {
      setError('');
      const encryptedText = encryptDES(input, key);
      setEncrypted(encryptedText);
      setDecrypted('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      setEncrypted('');
    }
  };

  const handleDecrypt = () => {
    try {
      setError('');
      const decryptedText = decryptDES(encrypted, key);
      setDecrypted(decryptedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      setDecrypted('');
    }
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="DES (Data Encryption Standard)"
        description="DES is a symmetric-key block cipher that was once the federal standard for data encryption. While no longer considered secure for modern applications, understanding DES is crucial for cryptography education."
        complexity="O(1) - Fixed input size of 64 bits"
        security="Vulnerable to brute force attacks due to 56-bit key size"
        applications={[
          "Historical banking systems",
          "Legacy secure communications",
          "Educational purposes",
          "Understanding block cipher design"
        ]}
        steps={[
          {
            title: "Initial Permutation (IP)",
            description: "The 64-bit input block is rearranged according to a fixed permutation table.",
            code: `const initialPermutation = (input) => {
  // 64-bit permutation
  return permute(input, IP_TABLE);
};`
          },
          {
            title: "Key Schedule",
            description: "Generate 16 48-bit subkeys from the 56-bit main key.",
            code: `const generateSubkeys = (key) => {
  // Remove parity bits
  const pc1Key = permute(key, PC1_TABLE);
  
  // Split into left and right halves
  let C = pc1Key.slice(0, 28);
  let D = pc1Key.slice(28);
  
  // Generate 16 subkeys
  const subkeys = [];
  for (let i = 0; i < 16; i++) {
    // Rotate according to schedule
    C = rotateLeft(C, ROTATION_SCHEDULE[i]);
    D = rotateLeft(D, ROTATION_SCHEDULE[i]);
    
    // Combine and permute
    const combined = C + D;
    subkeys[i] = permute(combined, PC2_TABLE);
  }
  
  return subkeys;
};`
          },
          {
            title: "Feistel Network Rounds",
            description: "16 rounds of substitution and permutation operations.",
            code: `const feistelRound = (right, subkey) => {
  // Expansion
  const expanded = permute(right, E_TABLE);
  
  // XOR with subkey
  const xored = xor(expanded, subkey);
  
  // S-box substitution
  let substituted = '';
  for (let i = 0; i < 8; i++) {
    const block = xored.slice(i * 6, (i + 1) * 6);
    substituted += sBox(i, block);
  }
  
  // P-box permutation
  return permute(substituted, P_TABLE);
};`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive DES Demonstration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Input Text</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter text to encrypt"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Key (64-bit)</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter encryption key"
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
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Animation visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">DES Structure</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80"
            alt="DES Structure Diagram"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Diagram showing the complete structure of the DES algorithm including initial permutation,
            16 rounds of Feistel network, and final permutation.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Key Schedule</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461278-49b5d0c87c95?auto=format&fit=crop&w=800&q=80"
            alt="DES Key Schedule"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Visualization of the DES key schedule showing how the 16 round keys are generated
            from the initial 56-bit key.
          </p>
        </div>
      </div>
    </div>
  );
}
