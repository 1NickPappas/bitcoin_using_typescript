
import Base58 from 'bs58';
import * as crypto from 'crypto';

// Network prefix for the Bitcoin Main Network
const MAIN_NETWORK_PREFIX = 0x00;

// Function to check if two buffers are equal
// - Define a function 'equalBuffers' that takes two Uint8Array buffers as input
// - Compare the lengths of the two buffers
// - Compare each byte of the buffers to check for equality
export function equalBuffers(buffer1: Uint8Array, buffer2: Uint8Array): boolean {
  if (buffer1.byteLength !== buffer2.byteLength) return false;
  let i = buffer1.byteLength;
  while (i--) {
    if (buffer1[i] !== buffer2[i]) return false;
  }
  return true;
}

// Function to convert a buffer to a hexadecimal string
// - Define a function 'bufferToHex' that takes a Uint8Array buffer as input
// - Convert the buffer to a hexadecimal string using Buffer methods
export function bufferToHex(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('hex');
}

// Function to hash a buffer first with SHA-256 and then with RIPEMD-160
// - Define a function 'hash160' that takes a Uint8Array buffer (public key) as input
// - Hash the buffer using SHA-256
// - Hash the resulting buffer using RIPEMD-160 to create the public key hash (pubKeyHash)
export function hash160(publicKey: Uint8Array): Buffer {
  let hash256 = crypto.createHash('sha256').update(publicKey).digest();
  let ripemd160 = crypto.createHash('ripemd160').update(hash256).digest();
  return ripemd160;
}

// Function to generate a Bitcoin address from a public key hash
// - Define a function 'createBitcoinAddressFromHash' that takes a Buffer public key hash (pubKeyHash) as input
// - Prepend the network prefix (0x00 for Main Network) to the public key hash
// - Calculate the checksum by double hashing the result using SHA-256
// - Append the checksum to the result
// - Encode the final result using Base58
export function createBitcoinAddressFromHash(publicKeyHash: Buffer): string {
  const networkPrefix = Buffer.from([MAIN_NETWORK_PREFIX]);
  const extendedPubKeyHash = Buffer.concat([networkPrefix, publicKeyHash]);

  // Compute checksum by double SHA-256 hashing the extended public key hash
  let hash1 = crypto.createHash('sha256').update(extendedPubKeyHash).digest();
  let hash2 = crypto.createHash('sha256').update(hash1).digest();
  const checksum = hash2.slice(0, 4);

  // Append checksum to the extended public key hash
  const extendedPubKeyHashChecksum = Buffer.concat([extendedPubKeyHash, checksum]);

  // Encode the result using Base58
  return Base58.encode(extendedPubKeyHashChecksum);
}

// Function to generate a Bitcoin address from a public key
// - Define a function 'createBitcoinAddress' that takes a Uint8Array public key as input
// - Hash the public key using the 'hash160' function to get the public key hash (pubKeyHash)
// - Generate a Bitcoin address from the hashed public key using 'createBitcoinAddressFromHash'
export function createBitcoinAddress(publicKey: Uint8Array): string {
  const publicKeyHash = hash160(publicKey);
  return createBitcoinAddressFromHash(publicKeyHash);
}

// Function to validate if a string is a valid Bitcoin address
// - Define a function 'isBitcoinAddress' that takes a string Bitcoin address as input
// - Decode the Bitcoin address using Base58
// - Check the length and network prefix of the decoded address
// - Return true if the address is valid, otherwise false
export function isBitcoinAddress(coinAddress: string): boolean {
  try {
    const decoded = Base58.decode(coinAddress);
    if (decoded.length !== 25) return false;
    if (decoded[0] !== MAIN_NETWORK_PREFIX) return false;
    return true;
  } catch (error) {
    return false;
  }
}
