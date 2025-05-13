import React, { useState } from 'react';
import { AlgorithmContent } from '../components/AlgorithmContent';
import { Hash, Play, Pause, SkipForward } from 'lucide-react';
import { hashInput } from '../../server/hash'; // Re-importing hashInput

export default function HashPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(''); // Define error state
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleHash = () => {
    try {
      const hashedValue = hashInput(input); // Call the hashInput function
      setOutput(hashedValue);
      setError(''); // Clear any previous error
    } catch (error) {
      setError((error as Error).message); // Handle error from hashInput
    }
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="SHA-256 (Secure Hash Algorithm 256-bit)"
        description="SHA-256 is a cryptographic hash function that generates a fixed-size 256-bit (32-byte) hash. It's part of the SHA-2 family designed by the NSA."
        complexity="O(n) where n is the input size in blocks"
        security="No known practical attacks that break SHA-256"
        applications={[
          "Digital signatures",
          "Password hashing",
          "Blockchain/Bitcoin",
          "File integrity verification",
          "SSL/TLS certificates"
        ]}
        steps={[
          {
            title: "Preprocessing",
            description: "Pad the message to ensure its length is a multiple of 512 bits.",
            code: `function preprocess(message) {
  // Convert to binary and pad
  let binary = toBinary(message);
  const length = binary.length;
  
  // Append 1
  binary += '1';
  
  // Pad with zeros
  while (binary.length % 512 !== 448) {
    binary += '0';
  }
  
  // Append original length as 64-bit big-endian
  binary += toBinary64(length);
  
  return binary;
}`
          },
          {
            title: "Message Schedule",
            description: "Create message schedule from padded message.",
            code: `function createMessageSchedule(block) {
  const W = new Array(64);
  
  // Copy block into first 16 words
  for (let t = 0; t < 16; t++) {
    W[t] = block.slice(t * 32, (t + 1) * 32);
  }
  
  // Extend to remaining words
  for (let t = 16; t < 64; t++) {
    W[t] = sigma1(W[t-2]) + W[t-7] + 
           sigma0(W[t-15]) + W[t-16];
  }
  
  return W;
}`
          },
          {
            title: "Compression Function",
            description: "Process each 512-bit block of the padded message.",
            code: `function compress(block, H) {
  const W = createMessageSchedule(block);
  let [a, b, c, d, e, f, g, h] = H;
  
  for (let t = 0; t < 64; t++) {
    const T1 = h + Sigma1(e) + Ch(e, f, g) + K[t] + W[t];
    const T2 = Sigma0(a) + Maj(a, b, c);
    
    h = g;
    g = f;
    f = e;
    e = d + T1;
    d = c;
    c = b;
    b = a;
    a = T1 + T2;
  }
  
  // Update hash values
  H[0] = a + H[0];
  H[1] = b + H[1];
  // ... continue for all hash values
}`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive SHA-256 Demonstration</h2>
        
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
              <label className="block text-sm font-medium mb-1">SHA-256 Hash</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono break-all">
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
          <h3 className="text-xl font-bold mb-4">SHA-256 Block Processing</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461441-99d5598b96f8?auto=format&fit=crop&w=800&q=80"
            alt="SHA-256 Block Processing"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Visualization of how SHA-256 processes each 512-bit block through its compression function.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">SHA-256 Round Function</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461397-4ee0fc595f35?auto=format&fit=crop&w=800&q=80"
            alt="SHA-256 Round Function"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Detailed view of the SHA-256 round function showing the operations performed in each step.
          </p>
        </div>
      </div>
    </div>
  );
}
