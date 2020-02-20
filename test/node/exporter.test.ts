import { ReadableSpan } from '@opentelemetry/tracing';
import * as http from 'http';
import * as assert from 'assert';
import * as sinon from 'sinon';
import { LightstepExporter, LightstepExporterConfig } from '../../src/exporter';

import { spanWithoutParent } from '../helper';

const fakeRequest = {
  end: function() {},
  on: function() {},
  write: function() {},
};

describe('LightstepExporter - node', () => {
  let exporter: LightstepExporter;
  let exporterConfig: LightstepExporterConfig;
  let spyRequest: any;
  let spyWrite: any;
  let spans: ReadableSpan[];
  describe('export', () => {
    beforeEach(() => {
      spyRequest = sinon.stub(http, 'request').returns(fakeRequest as any);
      spyWrite = sinon.stub(fakeRequest, 'write');
      exporterConfig = {
        token: 'abc',
        serviceName: 'bar',
        collector_host: 'http://foo.bar.com',
      };
      exporter = new LightstepExporter(exporterConfig);
      spans = [];
      spans.push(Object.assign({}, spanWithoutParent));
    });

    afterEach(() => {
      spyRequest.restore();
      spyWrite.restore();
    });

    it('should open the connection', done => {
      exporter.export(spans, function() {});

      setTimeout(() => {
        const args = spyRequest.args[0];
        const options = args[0];

        assert.strictEqual(options.hostname, 'foo.bar.com');
        assert.strictEqual(options.method, 'POST');
        assert.strictEqual(options.path, '/api/v2/reports');
        done();
      });
    });

    it('should successfully send the spans', done => {
      exporter.export(spans, function() {});

      setTimeout(() => {
        const writeArgs = spyWrite.args[0][0];
        assert.ok(writeArgs.length === 508);
        done();
      });
    });
  });
});
