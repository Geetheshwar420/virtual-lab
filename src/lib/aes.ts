// --- AES S-Box, Inverse S-Box and Rcon ---
const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
  0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
  0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
  0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
  0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
  0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
  0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
  0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
  0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
  0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
  0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
  0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
  0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
  0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
  0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
  0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
  0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const INV_SBOX = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38,
  0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
  0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d,
  0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2,
  0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
  0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda,
  0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a,
  0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
  0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea,
  0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85,
  0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
  0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20,
  0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31,
  0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
  0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0,
  0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26,
  0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

const RCON = [
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
];

// --- AES Core Functions ---
function subBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = SBOX[state[i][j]];
    }
  }
}

function invSubBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = INV_SBOX[state[i][j]];
    }
  }
}

function shiftRows(state: number[][]): void {
  // Row 1: left rotate by 1
  let temp = state[1][0];
  state[1][0] = state[1][1];
  state[1][1] = state[1][2];
  state[1][2] = state[1][3];
  state[1][3] = temp;

  // Row 2: left rotate by 2 (swap 0<->2 and 1<->3)
  temp = state[2][0];
  state[2][0] = state[2][2];
  state[2][2] = temp;
  temp = state[2][1];
  state[2][1] = state[2][3];
  state[2][3] = temp;

  // Row 3: left rotate by 3 (or right rotate by 1)
  temp = state[3][3];
  state[3][3] = state[3][2];
  state[3][2] = state[3][1];
  state[3][1] = state[3][0];
  state[3][0] = temp;
}

function invShiftRows(state: number[][]): void {
  // Row 1: right rotate by 1
  let temp = state[1][3];
  state[1][3] = state[1][2];
  state[1][2] = state[1][1];
  state[1][1] = state[1][0];
  state[1][0] = temp;

  // Row 2: right rotate by 2 (same as left rotate by 2)
  temp = state[2][0];
  state[2][0] = state[2][2];
  state[2][2] = temp;
  temp = state[2][1];
  state[2][1] = state[2][3];
  state[2][3] = temp;

  // Row 3: left rotate by 1
  temp = state[3][0];
  state[3][0] = state[3][1];
  state[3][1] = state[3][2];
  state[3][2] = state[3][3];
  state[3][3] = temp;
}

function multiply(a: number, b: number): number {
  let result = 0;
  while (b > 0) {
    if (b & 1) result ^= a;
    a <<= 1;
    if (a & 0x100) a ^= 0x11b;
    b >>= 1;
  }
  return result;
}

function mixColumns(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    const a = state[i][0];
    const b = state[i][1];
    const c = state[i][2];
    const d = state[i][3];
    
    state[i][0] = multiply(a, 0x02) ^ multiply(b, 0x03) ^ c ^ d;
    state[i][1] = a ^ multiply(b, 0x02) ^ multiply(c, 0x03) ^ d;
    state[i][2] = a ^ b ^ multiply(c, 0x02) ^ multiply(d, 0x03);
    state[i][3] = multiply(a, 0x03) ^ b ^ c ^ multiply(d, 0x02);
  }
}

function invMixColumns(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    const a = state[i][0];
    const b = state[i][1];
    const c = state[i][2];
    const d = state[i][3];
    
    state[i][0] = multiply(a, 0x0e) ^ multiply(b, 0x0b) ^ multiply(c, 0x0d) ^ multiply(d, 0x09);
    state[i][1] = multiply(a, 0x09) ^ multiply(b, 0x0e) ^ multiply(c, 0x0b) ^ multiply(d, 0x0d);
    state[i][2] = multiply(a, 0x0d) ^ multiply(b, 0x09) ^ multiply(c, 0x0e) ^ multiply(d, 0x0b);
    state[i][3] = multiply(a, 0x0b) ^ multiply(b, 0x0d) ^ multiply(c, 0x09) ^ multiply(d, 0x0e);
  }
}

function addRoundKey(state: number[][], roundKey: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] ^= roundKey[i][j];
    }
  }
}

function keyExpansion(key: number[]): number[][] {
  const Nk = key.length / 4;
  if (![4, 6, 8].includes(Nk)) {
    throw new Error("Key length must be 16, 24, or 32 bytes");
  }
  const Nb = 4;
  const Nr = Nk + 6;
  const expandedKey: number[][] = [];

  // Initialize first Nk words with the original key
  for (let i = 0; i < Nk; i++) {
    expandedKey[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
  }

  // Expand the key
  for (let i = Nk; i < Nb * (Nr + 1); i++) {
    let temp = [...expandedKey[i - 1]];
    
    if (i % Nk === 0) {
      temp = [temp[1], temp[2], temp[3], temp[0]]; // Rotate word
      temp = temp.map(byte => SBOX[byte]);          // Apply S-box
      temp[0] ^= RCON[(i / Nk) - 1];                 // XOR with Rcon
    } else if (Nk > 6 && (i % Nk) === 4) {
      temp = temp.map(byte => SBOX[byte]);
    }
    
    expandedKey[i] = expandedKey[i - Nk].map((byte, idx) => byte ^ temp[idx]);
  }

  return expandedKey;
}

// --- Conversion Between Text and State ---
// Converts a 16-character string to a 4x4 state matrix (column-major)
function textToState(text: string): number[][] {
  const state: number[][] = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    state[i % 4][Math.floor(i / 4)] = text.charCodeAt(i);
  }
  return state;
}

// Converts state matrix back to string (column-major)
function stateToText(state: number[][]): string {
  let text = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      text += String.fromCharCode(state[j][i]);
    }
  }
  return text;
}

// --- PKCS#7 Padding Functions ---
function pkcs7Pad(text: string, blockSize: number = 16): string {
  const padLength = blockSize - (text.length % blockSize);
  const padChar = String.fromCharCode(padLength);
  return text + padChar.repeat(padLength);
}

function pkcs7Unpad(text: string): string {
  const padLength = text.charCodeAt(text.length - 1);
  return text.slice(0, text.length - padLength);
}

// --- Block Encryption/Decryption (16-byte Blocks) ---
function encryptBlock(block: string, key: string): string {
  const state = textToState(block);
  const keyBytes = Array.from(key).map(c => c.charCodeAt(0));
  const expandedKey = keyExpansion(keyBytes);
  const Nk = keyBytes.length / 4;
  const Nr = Nk + 6;
  const Nb = 4;
  
  addRoundKey(state, [expandedKey[0], expandedKey[1], expandedKey[2], expandedKey[3]]);
  
  for (let round = 1; round < Nr; round++) {
    subBytes(state);
    shiftRows(state);
    mixColumns(state);
    addRoundKey(state, [
      expandedKey[round * Nb],
      expandedKey[round * Nb + 1],
      expandedKey[round * Nb + 2],
      expandedKey[round * Nb + 3]
    ]);
  }
  
  // Final round (no MixColumns)
  subBytes(state);
  shiftRows(state);
  addRoundKey(state, [
    expandedKey[Nr * Nb],
    expandedKey[Nr * Nb + 1],
    expandedKey[Nr * Nb + 2],
    expandedKey[Nr * Nb + 3]
  ]);
  
  return stateToText(state);
}

function decryptBlock(block: string, key: string): string {
  const state = textToState(block);
  const keyBytes = Array.from(key).map(c => c.charCodeAt(0));
  const expandedKey = keyExpansion(keyBytes);
  const Nk = keyBytes.length / 4;
  const Nr = Nk + 6;
  const Nb = 4;
  
  addRoundKey(state, [
    expandedKey[Nr * Nb],
    expandedKey[Nr * Nb + 1],
    expandedKey[Nr * Nb + 2],
    expandedKey[Nr * Nb + 3]
  ]);
  
  for (let round = Nr - 1; round >= 1; round--) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, [
      expandedKey[round * Nb],
      expandedKey[round * Nb + 1],
      expandedKey[round * Nb + 2],
      expandedKey[round * Nb + 3]
    ]);
    invMixColumns(state);
  }
  
  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, [expandedKey[0], expandedKey[1], expandedKey[2], expandedKey[3]]);
  
  return stateToText(state);
}

// --- High-Level AES Functions ---
// These functions operate on arbitrary-length messages in ECB mode using PKCS#7 padding.
// The ciphertext is encoded in Base64 for display.
export function encryptAES(message: string, key: string): string {
  if (![16, 24, 32].includes(key.length)) {
    throw new Error("Key length must be 16, 24, or 32 bytes");
  }
  
  const padded = pkcs7Pad(message, 16);
  let encrypted = "";
  
  for (let i = 0; i < padded.length; i += 16) {
    const block = padded.slice(i, i + 16);
    encrypted += encryptBlock(block, key);
  }
  
  return btoa(encrypted);
}

export function decryptAES(ciphertextBase64: string, key: string): string {
  if (![16, 24, 32].includes(key.length)) {
    throw new Error("Key length must be 16, 24, or 32 bytes");
  }
  
  const ciphertext = atob(ciphertextBase64);
  let decrypted = "";
  
  for (let i = 0; i < ciphertext.length; i += 16) {
    const block = ciphertext.slice(i, i + 16);
    decrypted += decryptBlock(block, key);
  }
  
  return pkcs7Unpad(decrypted);
}
