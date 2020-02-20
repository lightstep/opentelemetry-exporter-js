import * as assert from 'assert';
import * as transform from '../../src/transform';
import { SpanProto } from '../../src/types';
import {
  bodyBuffer,
  spanWithoutParent,
  spanBinary,
  spanBinaryWithParent,
  spanWithParent,
} from '../helper';

describe('transform', () => {
  describe('toSpan', () => {
    it('should convert Span to SpanProto', () => {
      const result: SpanProto = transform
        .toSpan(spanWithoutParent)
        .serializeBinary();
      assert.strictEqual(JSON.stringify(result), spanBinary, 'wrong span');
    });

    it('should convert Span with parent to SpanProto', () => {
      const result: SpanProto = transform
        .toSpan(spanWithParent)
        .serializeBinary();
      assert.strictEqual(
        JSON.stringify(result),
        spanBinaryWithParent,
        'wrong span'
      );
    });
  });

  describe('toBuffer', () => {
    it('should convert Span and other params to body to be sent', () => {
      const result: Uint8Array = transform.toBuffer(
        '1234abcd1234abcd',
        'test',
        '0.1.0',
        {
          foo: 'bar',
        },
        transform.createAuthProto('dkasjdalsjdlaksjdkaskldj'),
        [123, 123],
        [transform.toSpan(spanWithoutParent)]
      );
      assert.strictEqual(JSON.stringify(result), bodyBuffer, 'wrong buffer');
    });
  });
});
