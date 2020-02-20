import * as assert from 'assert';
import * as utils from '../../src/utils';

describe('utils', () => {
  describe('hexToDec', () => {
    it('should convert hex to dec', () => {
      const result = utils.hexToDec('ab42124a3c573678d4d8b21ba52df3bf');
      assert.strictEqual(result, '227641049836815339047986378068932293567');
    });

    it('should convert hex to dec when it starts from "0x"', () => {
      const result = utils.hexToDec('0xab42124a3c573678d4d8b21ba52df3bf');
      assert.strictEqual(result, '227641049836815339047986378068932293567');
    });
  });
  describe('generateLongUUID', () => {
    it('should generate uuid', () => {
      const result = utils.generateLongUUID();
      assert.ok(result.match(/[0-9abcdef]{16}/));
    });
  });
});
