import * as assert from 'assert';
import { createReportRequest } from '../../src/create-report-request';
import * as ls from '../../src/types';
import { spanWithParent, reportJSON } from '../helper';

describe('createReportRequest', () => {
  it('should convert Span and other params to body to be sent', () => {
    const guid = '1234abcd1234abcd';
    const token = 'dkasjdalsjdlaksjdkaskldj';
    const tags = { foo: 'bar' };
    const result: ls.ReportRequest = createReportRequest(guid, token, tags, [
      spanWithParent,
    ]);

    assert.deepEqual(result, reportJSON, 'wrong report');
  });
});
