import React, { useState } from 'react';
import { AlgorithmContent } from '../components/AlgorithmContent';
import { Hash, Play, Pause, SkipForward } from 'lucide-react';

const MD5Page: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleHash = async () => {
    try {
      setError('');
      const response = await fetch('/api/md5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      setOutput(data.hash);
    } catch (err) {
      setError('An error occurred while hashing the message.');
    }
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="MD5 (Message Digest Algorithm 5)"
        description="MD5 is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value. While no longer considered cryptographically secure, it remains important for understanding hash function design."
        complexity="O(n) where n is the input size in blocks"
        security="Vulnerable to collision attacks, not recommended for security-critical applications"
        applications={[
          "File integrity verification (legacy systems)",
          "Password hashing (deprecated)",
          "Checksum generation",
          "Educational purposes"
        ]}
        steps={[
          {
            title: "Padding",
            description: "Pad the message to ensure its length is congruent to 448 modulo 512.",
            code: `const padMessage = (message) => {
  // Convert to binary
  let binary = toBinary(message);
  
  // Add '1' bit
  binary += '1';
  
  // Pad with zeros
  while (binary.length % 512 !== 448) {
    binary += '0';
  }
  
  // Append original length
  binary += toBinary64(message.length);
  
  return binary;
};`
          },
          {
            title: "Initialize Variables",
            description: "Initialize four 32-bit registers with specific constants.",
            code: `const initializeRegisters = () => {
  return {
    A: 0x67452301,
    B: 0xEFCDAB89,
    C: 0x98BADCFE,
    D: 0x10325476
  };
};`
          },
          {
            title: "Process Message Blocks",
            description: "Process each 512-bit block using four rounds of operations.",
            code: `const processBlock = (block, registers) => {
  let { A, B, C, D } = registers;
  
  // Round 1
  for (let i = 0; i < 16; i++) {
    const F = (B & C) | (~B & D);
    const g = i;
    
    const temp = D;
    D = C;
    C = B;
    B = B + leftRotate((A + F + K[i] + M[g]), s[i]);
    A = temp;
  }
  
  // Rounds 2-4 follow similar pattern
  // ...
  
  return { A, B, C, D };
};`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive MD5 Demonstration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Input Text</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-32"
                placeholder="Enter text to hash"
              />
            </div>

            <button
              onClick={handleHash}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Hash className="w-4 h-4" />
              <span>Generate Hash</span>
            </button>

            {error && <div className="text-red-500">{error}</div>} {/* Display error message */}

            <div>
              <label className="block text-sm font-medium mb-1">MD5 Hash</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono">
                {output}
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
                <p className="text-gray-500">Hash computation visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">MD5 Block Processing</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461441-99d5598b96f8?auto=format&fit=crop&w=800&q=80"
            alt="MD5 Block Processing Diagram"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Diagram showing how MD5 processes each 512-bit block of input data through its
            compression function.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">MD5 Round Function</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461397-4ee0fc595f35?auto=format&fit=crop&w=800&q=80"
            alt="MD5 Round Function"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Detailed view of the MD5 round function showing the operations performed in each
            of the four rounds of processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MD5Page;