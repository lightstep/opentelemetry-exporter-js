import * as assert from 'assert';
import { createReport } from '../../src/create-report';
import * as ls from '../../src/types';
import { spanWithParent, reportJSON } from '../helper';

describe('createReport', () => {
  it('should convert Span and other params to body to be sent', () => {
    const guid = '1234abcd1234abcd';
    const token = 'dkasjdalsjdlaksjdkaskldj';
    const tags = { foo: 'bar' };
    const result: ls.ReportRequest = createReport(
      guid,
      token,
      tags
    )([spanWithParent]);

    assert.strictEqual(JSON.stringify(result), reportJSON, 'wrong buffer');
  });
});
