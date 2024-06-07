//TODO need to check if the tests is valid and improve them.

import { equalBuffers, bufferToHex, hash160, createBitcoinAddressFromHash, createBitcoinAddress, isBitcoinAddress } from '../src/utils'; // adjust the path as needed


describe('Bitcoin Utilities', () => {
  // equalBuffers tests
  describe('equalBuffers', () => {
    it('should return true for equal buffers', () => {
      const buffer1 = Uint8Array.from([1, 2, 3, 4, 5]);
      const buffer2 = Uint8Array.from([1, 2, 3, 4, 5]);
      expect(equalBuffers(buffer1, buffer2)).toBe(true);
    });

    it('should return false for different buffers', () => {
      const buffer1 = Uint8Array.from([1, 2, 3, 4, 5]);
      const buffer2 = Uint8Array.from([1, 2, 3, 4, 6]);
      expect(equalBuffers(buffer1, buffer2)).toBe(false);
    });

    it('should return false for buffers of different lengths', () => {
      const buffer1 = Uint8Array.from([1, 2, 3, 4, 5]);
      const buffer2 = Uint8Array.from([1, 2, 3, 4]);
      expect(equalBuffers(buffer1, buffer2)).toBe(false);
    });
  });

  // bufferToHex tests
  describe('bufferToHex', () => {
    it('should convert buffer to hex string', () => {
      const buffer = Uint8Array.from([1, 2, 3, 4, 5]);
      const expectedHex = '0102030405';
      expect(bufferToHex(buffer)).toBe(expectedHex);
    });

    it('should handle empty buffer', () => {
      const buffer = Uint8Array.from([]);
      const expectedHex = '';
      expect(bufferToHex(buffer)).toBe(expectedHex);
    });

    it('should convert buffer with single byte', () => {
      const buffer = Uint8Array.from([255]);
      const expectedHex = 'ff';
      expect(bufferToHex(buffer)).toBe(expectedHex);
    });
  });

  // hash160 tests
  describe('hash160', () => {
    it('should hash public key with SHA-256 and RIPEMD-160', () => {
      const publicKey = Uint8Array.from(Buffer.from('04b0bd634234abbb1ba1e986e884185c6ec5de477b8d43c8a9df5c503f019f8c1a5e8c59ce8a13b55c70e9d5363b3f4e80608ff2b56d9a0e77c8b0916aabf1b6d1', 'hex'));
      const expectedHash = '9b00fdfc7d6818c476f9bbde14c197edb35c4b2a';
      expect(bufferToHex(hash160(publicKey))).toBe(expectedHash);
    });

    it('should produce consistent results for the same input', () => {
      const publicKey = Uint8Array.from(Buffer.from('04b0bd634234abbb1ba1e986e884185c6ec5de477b8d43c8a9df5c503f019f8c1a5e8c59ce8a13b55c70e9d5363b3f4e80608ff2b56d9a0e77c8b0916aabf1b6d1', 'hex'));
      const hash1 = hash160(publicKey);
      const hash2 = hash160(publicKey);
      expect(equalBuffers(hash1, hash2)).toBe(true);
    });

    it('should handle empty public key', () => {
      const publicKey = Uint8Array.from([]);
      const expectedHash = 'b472a266d0bd89c13706a4132ccfb16f7c3b9fcb';
      expect(bufferToHex(hash160(publicKey))).toBe(expectedHash);
    });
  });

  // createBitcoinAddressFromHash tests
  describe('createBitcoinAddressFromHash', () => {
    it('should generate a Bitcoin address from a public key hash', async () => {
      const pubKeyHash = Uint8Array.from(Buffer.from('9b00fdfc7d6818c476f9bbde14c197edb35c4b2a', 'hex'));
      const expectedAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7VG';
      expect(await createBitcoinAddressFromHash(pubKeyHash)).toBe(expectedAddress);
    });

    it('should generate consistent addresses for the same public key hash', async () => {
      const pubKeyHash = Uint8Array.from(Buffer.from('9b00fdfc7d6818c476f9bbde14c197edb35c4b2a', 'hex'));
      const address1 = await createBitcoinAddressFromHash(pubKeyHash);
      const address2 = await createBitcoinAddressFromHash(pubKeyHash);
      expect(address1).toBe(address2);
    });

    it('should handle different public key hashes', async () => {
      const pubKeyHash1 = Uint8Array.from(Buffer.from('9b00fdfc7d6818c476f9bbde14c197edb35c4b2a', 'hex'));
      const pubKeyHash2 = Uint8Array.from(Buffer.from('89abcdefabcdefabcdefabcdefabcdefabcdefabcdef', 'hex'));
      expect(await createBitcoinAddressFromHash(pubKeyHash1)).not.toBe(await createBitcoinAddressFromHash(pubKeyHash2));
    });
  });

  // createBitcoinAddress tests
  describe('createBitcoinAddress', () => {
    it('should generate a Bitcoin address from a public key', async () => {
      const publicKey = Uint8Array.from(Buffer.from('04b0bd634234abbb1ba1e986e884185c6ec5de477b8d43c8a9df5c503f019f8c1a5e8c59ce8a13b55c70e9d5363b3f4e80608ff2b56d9a0e77c8b0916aabf1b6d1', 'hex'));
      const expectedAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7VG';
      expect(await createBitcoinAddress(publicKey)).toBe(expectedAddress);
    });

    it('should generate consistent addresses for the same public key', async () => {
      const publicKey = Uint8Array.from(Buffer.from('04b0bd634234abbb1ba1e986e884185c6ec5de477b8d43c8a9df5c503f019f8c1a5e8c59ce8a13b55c70e9d5363b3f4e80608ff2b56d9a0e77c8b0916aabf1b6d1', 'hex'));
      const address1 = await createBitcoinAddress(publicKey);
      const address2 = await createBitcoinAddress(publicKey);
      expect(address1).toBe(address2);
    });

    it('should handle different public keys', async () => {
      const publicKey1 = Uint8Array.from(Buffer.from('04b0bd634234abbb1ba1e986e884185c6ec5de477b8d43c8a9df5c503f019f8c1a5e8c59ce8a13b55c70e9d5363b3f4e80608ff2b56d9a0e77c8b0916aabf1b6d1', 'hex'));
      const publicKey2 = Uint8Array.from(Buffer.from('0488b21e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex'));
      expect(await createBitcoinAddress(publicKey1)).not.toBe(await createBitcoinAddress(publicKey2));
    });
  });

  // isBitcoinAddress tests
  describe('isBitcoinAddress', () => {
    it('should validate a correct Bitcoin address', async () => {
      const validAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7VG';
      expect(await isBitcoinAddress(validAddress)).toBe(true);
    });

    it('should invalidate an incorrect Bitcoin address', async () => {
      const invalidAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7VXXXX';
      expect(await isBitcoinAddress(invalidAddress)).toBe(false);
    });

    it('should invalidate a Bitcoin address with an incorrect checksum', async () => {
      const invalidChecksumAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7V1234';
      expect(await isBitcoinAddress(invalidChecksumAddress)).toBe(false);
    });

    it('should invalidate a Bitcoin address with an incorrect length', async () => {
      const invalidLengthAddress = '1JbqKPUxH3MPzZJHg2qZv4G3Fqpa7r7VG1234';
      expect(await isBitcoinAddress(invalidLengthAddress)).toBe(false);
    });
  });
});
