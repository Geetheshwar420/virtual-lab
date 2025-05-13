import React, { useState } from "react";

// Mock AES functions for demonstration purposes
const encryptAES = (plaintext: string, key: string): string => {
  // Mock encryption logic
  return btoa(plaintext);
};

const decryptAES = (ciphertext: string, key: string): string => {
  // Mock decryption logic
  return atob(ciphertext);
};

interface AesDemoProps {
  message: string;
  key: string;
  isDecryption: boolean;
}

const AesDemo: React.FC<AesDemoProps> = ({ message, key, isDecryption }) => {

  // States for encryption
  const plaintext = message; // Use the message prop
  const encKey = key; // Use the key prop

  const [encryptedResult, setEncryptedResult] = useState("");
  const [encVisualization, setEncVisualization] = useState<string[]>([]);

  // States for decryption
  const [ciphertext, setCiphertext] = useState("");
  const [decKey, setDecKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  const [decVisualization, setDecVisualization] = useState<string[]>([]);

  // Helper: PKCS#7 padding for visualization purposes.
  const pkcs7Pad = (text: string, blockSize = 16): string => {
    const padLength = blockSize - (text.length % blockSize);
    return text + String.fromCharCode(padLength).repeat(padLength);
  };

  const handleEncrypt = () => {
    if (![16, 24, 32].includes(encKey.length)) {
      alert("Key must be 16, 24, or 32 characters");
      return;
    }

    // Pad message for visualization
    const paddedMsg = pkcs7Pad(plaintext, 16);
    const blocks: string[] = [];
    for (let i = 0; i < paddedMsg.length; i += 16) {
      blocks.push(paddedMsg.slice(i, i + 16));
    }
    setEncVisualization(blocks);

    // Simulate a brief processing delay before encryption output
    setTimeout(() => {
      try {
        const encrypted = encryptAES(plaintext, encKey);
        setEncryptedResult(encrypted);
      } catch (err) {
        console.error(err);
        alert("Encryption error: " + err);
      }
    }, 1500);
  };

  const handleDecrypt = () => {
    if (![16, 24, 32].includes(decKey.length)) {
      alert("Key must be 16, 24, or 32 characters");
      return;
    }
    try {
      const decoded = atob(ciphertext);
      const blocks: string[] = [];
      for (let i = 0; i < decoded.length; i += 16) {
        blocks.push(decoded.slice(i, i + 16));
      }
      setDecVisualization(blocks);

      // Simulate a brief processing delay before decryption output
      setTimeout(() => {
        try {
          const decrypted = decryptAES(ciphertext, decKey);
          setDecryptedResult(decrypted);
        } catch (err) {
          console.error(err);
          alert("Decryption error: " + err);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Invalid Base64 ciphertext");
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "600px",
        margin: "2em auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>AES Encryption/Decryption Visual Demo</h1>

      {/* Encryption Section */}
      <h2>Encryption</h2>
      <input
        type="text"
        value={plaintext}
        placeholder="Enter your message"
        size={40}
      />



      <br />
      <input
        type="text"
        value={encKey}
        placeholder="Enter key (16, 24, or 32 chars)"
        size={40}
      />

      <br />
      <button onClick={handleEncrypt}>Encrypt</button>
      <div id="encVisualization">
        <h3>Plaintext Blocks (with padding applied)</h3>
        {encVisualization.map((block, index) => (
          <div
            key={index}
            className="block"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1em 0",
            }}
          >
            {block.split("").map((ch, i) => (
              <div
                key={i}
                className="box"
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  margin: "2px",
                  border: "1px solid #ccc",
                  lineHeight: "40px",
                  fontSize: "14px",
                  textAlign: "center",
                  background: "#f9f9f9",
                }}
              >
                {ch.charCodeAt(0)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div id="encryptedResult">
        {encryptedResult && (
          <>
            <h3>Encrypted Output (Base64):</h3>
            <p>{encryptedResult}</p>
          </>
        )}
      </div>

      <hr />

      {/* Decryption Section */}
      <h2>Decryption</h2>
      <input
        type="text"
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        placeholder="Enter Base64 ciphertext"
        size={40}
      />
      <br />
      <input
        type="text"
        value={decKey}
        onChange={(e) => setDecKey(e.target.value)}
        placeholder="Enter key (16, 24, or 32 chars)"
        size={40}
      />
      <br />
      <button onClick={handleDecrypt}>Decrypt</button>
      <div id="decVisualization">
        <h3>Ciphertext Blocks (Base64 Decoded)</h3>
        {decVisualization.map((block, index) => (
          <div
            key={index}
            className="block"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1em 0",
            }}
          >
            {block.split("").map((ch, i) => (
              <div
                key={i}
                className="box"
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  margin: "2px",
                  border: "1px solid #ccc",
                  lineHeight: "40px",
                  fontSize: "14px",
                  textAlign: "center",
                  background: "#f9f9f9",
                }}
              >
                {ch.charCodeAt(0)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div id="decryptedResult">
        {decryptedResult && (
          <>
            <h3>Decrypted Output:</h3>
            <p>{decryptedResult}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AesDemo;
