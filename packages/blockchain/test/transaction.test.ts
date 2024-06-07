
import { createRawTransaction } from '../src/transaction';

// Test data
const inputs = [
  { txId: 'e3c0c78948d1f1d7af3f58af92a3c1b5e6c2c6c3e4b1b2a3d4e5f6d7c8b9a0a1', vout: 0 }
];

const outputs = [
  { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: 10000 }
];

describe('createRawTransaction', () => {
  it('should create a raw transaction correctly', async () => {
    const expectedRawTx = '0100000001a1a0b9c8d7f6e5d4a3b2b1e4c3c6e6b5c1a3f5f7d1d7c789c0e3000000000000ffffffff01000027101976a91462e907b15cbf27d5425399ebf6f0fb50ebb88f18c88ac00000000';
    const rawTx = await createRawTransaction(inputs, outputs);
    expect(rawTx).toBe(expectedRawTx);
  });

  it('should handle multiple inputs and outputs', async () => {
    const multipleInputs = [
      { txId: 'e3c0c78948d1f1d7af3f58af92a3c1b5e6c2c6c3e4b1b2a3d4e5f6d7c8b9a0a1', vout: 0 },
      { txId: 'a1a0b9c8d7f6e5d4a3b2b1e4c3c6e6b5c1a3f5f7d1d7c789c0e3e3c0c78948d1', vout: 1 }
    ];

    const multipleOutputs = [
      { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: 10000 },
      { address: '1dice8EMZmqKvrGE4Qc9bUFf9PX3xaYDp', amount: 5000 }
    ];

    const expectedRawTx = '0100000002a1a0b9c8d7f6e5d4a3b2b1e4c3c6e6b5c1a3f5f7d1d7c789c0e3000000000000ffffffffd14889c7c0e3e3c0f7f5a3b5e6c6c3e4e1b2b1a3d4e5f6d7b9a0a1a10000000000ffffffff02000027101976a91462e907b15cbf27d5425399ebf6f0fb50ebb88f18c88ac00001388041976a9140e80a256a549aa5d86e3b2db301ae39b62616f5f88ac00000000';
    const rawTx = await createRawTransaction(multipleInputs, multipleOutputs);
    expect(rawTx).toBe(expectedRawTx);
  });
});
