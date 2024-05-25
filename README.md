

### Step 0: Create Utility Functions

Before diving into the blockchain implementation, we need to create some utility functions that will be used throughout the project. This will include functions for hashing, encoding, and validating addresses.

1. **Initialize utilities file:**
   Create a new file `utils.ts` in the `src` directory.

2. **Implement utility functions:**
   - `bufferEqual(a: Uint8Array, b: Uint8Array): boolean`: Check if two buffers are equal.
   - `bufferToHex(buffer: Uint8Array): string`: Convert a buffer to a hexadecimal string.
   - `hash160(buffer: Uint8Array): Buffer`: Hash a buffer with SHA-256 followed by RIPEMD-160.
   - `coinAddress(publicKey: Uint8Array): string`: Generate a coin address from a public key.
   - `coinAddressFromHash(publicKeyHash: Uint8Array): string`: Generate a coin address from a public key hash.
   - `bytesToHex(bytes: Uint8Array): string`: Convert bytes to a hexadecimal string.
   - `isCoinAddress(coinAddress: string): boolean`: Validate if a string is a valid coin address.
   - `extractHash160FromCoinAddress(coinAddress: string): Uint8Array`: Extract the hash160 from a coin address.
   - `ripemd160(buffer: Uint8Array): Buffer`: Hash a buffer using RIPEMD-160.
   - `SHA256(buffer: Uint8Array): Buffer`: Hash a buffer using SHA-256.
   - `doubleSHA256(buffer: Uint8Array): Buffer`: Double hash a buffer using SHA-256.
   - `hashBuffer(buffer: Uint8Array): bigint`: Hash a buffer and return a bigint.
   - `bigIntTo32Buffer(n: bigint): Uint8Array`: Convert a bigint to a 32-byte buffer.
   - `bufferToBigInt(buffer: Uint8Array): bigint`: Convert a buffer to a bigint.

3. **Test utility functions:**
   Create `utils.test.ts` to write tests for each utility function to ensure they work correctly.
