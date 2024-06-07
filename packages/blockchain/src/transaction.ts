
import * as base58 from 'noble-base58check';

// Helper function to convert a number to a VarInt
function varInt(n: number): string {
  if (n < 0xfd) {
    return n.toString(16).padStart(2, '0');
  } else if (n <= 0xffff) {
    return 'fd' + n.toString(16).padStart(4, '0');
  } else if (n <= 0xffffffff) {
    return 'fe' + n.toString(16).padStart(8, '0');
  } else {
    return 'ff' + n.toString(16).padStart(16, '0');
  }
}

// Helper function to reverse bytes for little-endian
function reverseBytes(hex: string): string {
  return hex.match(/.{2}/g)!.reverse().join('');
}

// Helper function to create a scriptPubKey for P2PKH
async function createScriptPubKey(address: string): Promise<string> {
  const decoded = Buffer.from(await base58.decode(address)).toString('hex');
  const pubKeyHash = decoded.substring(2, 42);
  return '76a914' + pubKeyHash + '88ac';
}

// Constructing a raw Bitcoin transaction
export async function createRawTransaction(inputs: any[], outputs: any[]): Promise<string> {
  // Step 1: Define the transaction version (1 in little-endian)
  const version = '01000000';

  // Step 2: Define the inputs count
  const inputCount = varInt(inputs.length);

  // Step 3: Define the inputs
  let inputData = '';
  inputs.forEach(input => {
    const prevTxHash = reverseBytes(input.txId);
    const prevTxIndex = reverseBytes(input.vout.toString(16).padStart(8, '0'));
    const scriptSig = ''; // Will be filled after signing
    const scriptSigLength = varInt(scriptSig.length / 2);
    const sequence = 'ffffffff';
    inputData += prevTxHash + prevTxIndex + scriptSigLength + scriptSig + sequence;
  });

  // Step 4: Define the outputs count
  const outputCount = varInt(outputs.length);
  // Step 5: Define the outputs
  let outputData = '';
  for (const output of outputs) {
    const satoshis = reverseBytes(output.amount.toString(16).padStart(16, '0'));
    const scriptPubKey = await createScriptPubKey(output.address);
    const scriptPubKeyLength = varInt(scriptPubKey.length / 2);
    outputData += satoshis + scriptPubKeyLength + scriptPubKey;
  }
  // Step 6: Define the locktime
  const locktime = '00000000';

  // Combine all parts to form the raw transaction (without signature)
  const rawTx = version + inputCount + inputData + outputCount + outputData + locktime;

  return rawTx;
}
