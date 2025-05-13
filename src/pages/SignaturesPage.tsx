import React, { useState } from 'react';
import { AlgorithmContent } from '../components/AlgorithmContent';
import { FileSignature, Play, Pause, SkipForward, Check, X } from 'lucide-react';

export function SignaturesPage() {
  const [message, setMessage] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerateKeys = () => {
    // Implementation would go here
    setPublicKey('Generated public key would appear here');
    setPrivateKey('Generated private key would appear here');
  };

  const handleSign = () => {
    // Implementation would go here
    setSignature('Generated signature would appear here');
  };

  const handleVerify = () => {
    // Implementation would go here
    setVerificationResult(true);
  };

  return (
    <div className="space-y-8">
      <AlgorithmContent
        title="ECDSA (Elliptic Curve Digital Signature Algorithm)"
        description="ECDSA is a cryptographic algorithm used to create digital signatures using elliptic curve cryptography. It provides a high level of security with smaller key sizes compared to RSA."
        complexity="Signing: O(log n), Verification: O(log n)"
        security="Security relies on the elliptic curve discrete logarithm problem (ECDLP)"
        applications={[
          "Bitcoin transactions",
          "Secure messaging apps",
          "Document signing",
          "Code signing",
          "SSL/TLS certificates"
        ]}
        steps={[
          {
            title: "Key Generation",
            description: "Generate public and private keys using an elliptic curve.",
            code: `function generateKeyPair() {
  // Select a secure curve (e.g., secp256k1)
  const curve = new EllipticCurve('secp256k1');
  
  // Generate private key (random integer)
  const privateKey = generateSecureRandom();
  
  // Calculate public key: Q = dG
  const publicKey = curve.multiply(curve.G, privateKey);
  
  return { privateKey, publicKey };
}`
          },
          {
            title: "Signing",
            description: "Create a digital signature for a message.",
            code: `function sign(message, privateKey) {
  // Generate random nonce k
  const k = generateSecureRandom();
  
  // Calculate r = (k * G).x mod n
  const R = curve.multiply(curve.G, k);
  const r = R.x % curve.n;
  
  // Calculate s = k^(-1)(hash(m) + r * privateKey) mod n
  const h = hash(message);
  const s = (modInverse(k, curve.n) * 
    (h + r * privateKey)) % curve.n;
  
  return { r, s };
}`
          },
          {
            title: "Verification",
            description: "Verify the signature using the public key.",
            code: `function verify(message, signature, publicKey) {
  const { r, s } = signature;
  
  // Calculate w = s^(-1) mod n
  const w = modInverse(s, curve.n);
  
  // Calculate u1 = hash(m) * w mod n
  const h = hash(message);
  const u1 = (h * w) % curve.n;
  
  // Calculate u2 = r * w mod n
  const u2 = (r * w) % curve.n;
  
  // Calculate (u1 * G + u2 * Q).x
  const point = curve.add(
    curve.multiply(curve.G, u1),
    curve.multiply(publicKey, u2)
  );
  
  // Verify r equals point.x mod n
  return r === point.x % curve.n;
}`
          }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive ECDSA Demonstration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <button
              onClick={handleGenerateKeys}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <FileSignature className="w-4 h-4" />
              <span>Generate Key Pair</span>
            </button>

            <div>
              <label className="block text-sm font-medium mb-1">Public Key</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm">
                {publicKey}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Private Key</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm">
                {privateKey}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-20"
                placeholder="Enter message to sign"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSign}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <FileSignature className="w-4 h-4" />
                <span>Sign</span>
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Signature</label>
              <div className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono">
                {signature}
              </div>
            </div>

            {verificationResult !== null && (
              <div className={`p-4 rounded-lg ${
                verificationResult 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {verificationResult ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Signature verified successfully!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span>Signature verification failed!</span>
                    </>
                  )}
                </div>
              </div>
            )}
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
                <p className="text-gray-500">ECDSA operation visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">ECDSA Signing Process</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461264-6c9e4a9f8ecc?auto=format&fit=crop&w=800&q=80"
            alt="ECDSA Signing Process"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Visualization of the ECDSA signing process, showing how digital signatures
            are created using elliptic curve operations.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">ECDSA Verification</h3>
          <img
            src="https://images.unsplash.com/photo-1633419461440-e8a3a556e9be?auto=format&fit=crop&w=800&q=80"
            alt="ECDSA Verification Process"
            className="w-full rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Diagram showing the ECDSA signature verification process and how the
            mathematical operations ensure authenticity.
          </p>
        </div>
      </div>
    </div>
  );
}
