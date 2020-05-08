import * as assert from 'assert';
import * as transform from '../../src/transform';
import * as ls from '../../src/types';
import {
  spanJSON,
  spanWithParentJSON,
  spanWithParent,
  spanWithoutParent,
} from '../helper';

describe('transform', () => {
  describe('toSpan', () => {
    it('should convert Span to LS Span', () => {
      const result: ls.Span = transform.toSpan(spanWithoutParent);
      assert.deepEqual(result, spanJSON, 'wrong span');
    });

    it('should convert Span with parent to LS Span', () => {
      const result: ls.Span = transform.toSpan(spanWithParent);
      assert.deepEqual(result, spanWithParentJSON, 'wrong span');
    });
  });
});
