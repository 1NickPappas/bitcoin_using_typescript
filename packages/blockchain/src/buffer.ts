/**
 * This module provides utility classes and functions for reading from and writing to buffers,
 * specifically tailored for handling Bitcoin-related data structures.
 *
 * The `BitcoinReader` class offers methods to read various data types from a buffer,
 * which is crucial for parsing Bitcoin transactions, blocks, and other protocol messages.
 *
 * The `BitcoinWriter` class provides methods to write different data types to a buffer,
 * enabling the construction and serialization of Bitcoin transactions and other data structures.
 *
 * The `varUintBytes` function calculates the length in bytes required to encode a given integer
 * using Bitcoin's variable-length integer encoding scheme.
 *
 * These utilities are essential for maintaining data integrity and ensuring consistent handling
 * of binary data within Bitcoin applications.
 */

import * as varUint from 'varuint-bitcoin';

/**
 * Calculate the number of bytes required to encode a given integer using
 * Bitcoin's variable-length integer encoding scheme.
 * 
 * @param n - The integer to encode.
 * @returns The number of bytes required.
 */
export function varUintBytes(n: number): number {
  return varUint.encodingLength(n);
}


export class BitcoinReader {
  public readonly size: number;
  private readonly dataView: DataView;

  constructor(public readonly buffer: Buffer, public offset = 0) {
    this.size = buffer.length;
    this.dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  /**
  * Check if there is still data left to parse in the buffer.
  */
  isParsing(): boolean {
    return this.offset < this.buffer.byteLength;
  }

  /**
   * Read a single byte from the buffer and advance the offset.
   */
  eatByte(): number {
    return this.buffer[this.offset++];
  }

  /**
   * Read a specified number of bytes from the buffer and advance the offset.
   */
  eatBuffer(size: number): Uint8Array {
    const slice = this.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return slice;
  }

  /**
   * Read a 32-bit unsigned integer from the buffer and advance the offset.
   */
  eatUInt32(): number {
    const value = this.dataView.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  /**
   * Read a specified number of bytes into a slice from the buffer and advance the offset.
   */
  eatSlice(length: number): Uint8Array {
    const slice = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return slice;
  }

  /**
   * Read a variable-length unsigned integer from the buffer and advance the offset.
   */
  eatVarUint(): number {
    const value = varUint.decode(this.buffer, this.offset);
    this.offset += varUint.decode.bytes;
    return value;
  }

  /**
   * Read a 64-bit unsigned integer as a bigint from the buffer and advance the offset.
   */
  eatBigInt64(): bigint {
    const value = this.dataView.getBigUint64(this.offset, true);
    this.offset += 8;
    return value;
  }
}


export class BitcoinWriter {
  private readonly dataView: DataView;

  constructor(public readonly buffer: Buffer, public offset: number = 0) {
    this.dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  /**
   * Write a 32-bit unsigned integer to the buffer and advance the offset.
   */
  writeUint32(value: number): void {
    this.dataView.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  /**
   * Write a specified buffer starting at the given offset to the buffer and advance the offset.
   */
  writeBuffer(buffer: Uint8Array, offset: number = 0): void {
    this.buffer.set(buffer, this.offset);
    this.offset += buffer.byteLength;
  }

  /**
   * Write a single byte to the buffer and advance the offset.
   */
  writeByte(value: number): void {
    this.buffer[this.offset++] = value;
  }

  /**
   * Write a 64-bit unsigned integer as a bigint to the buffer and advance the offset.
   */
  writeBigUint(value: bigint): void {
    this.dataView.setBigUint64(this.offset, value, true);
    this.offset += 8;
  }

  /**
   * Write a variable-length unsigned integer to the buffer and advance the offset.
   */
  writeVarUint(value: number): void {
    varUint.encode(value, this.buffer, this.offset);
    this.offset += varUint.encode.bytes;
  }
}
