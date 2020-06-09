import { ReadableSpan } from '@opentelemetry/tracing';
import * as assert from 'assert';
import * as sinon from 'sinon';
import { LightstepExporter, LightstepExporterConfig } from '../../src/exporter';

import { assertValidPostBody, spanWithoutParent } from '../helper';
const sendBeacon = navigator.sendBeacon;

describe('LightstepExporter - web', () => {
  let exporter: LightstepExporter;
  let ExporterConfig: LightstepExporterConfig;
  let spyBeacon: any;
  let spans: ReadableSpan[];

  beforeEach(() => {
    spyBeacon = sinon.stub(navigator, 'sendBeacon');
    ExporterConfig = {
      serviceName: 'bar',
      token: 'abc',
      collectorUrl: 'http://foo.bar.com',
    };
    exporter = new LightstepExporter(ExporterConfig);
    spans = [];
    spans.push(Object.assign({}, spanWithoutParent));
  });

  afterEach(() => {
    navigator.sendBeacon = sendBeacon;
    spyBeacon.restore();
  });

  describe('export', () => {
    describe('when "sendBeacon" is available', () => {
      describe('AND token is NOT available', () => {
        it('should successfully send the spans using sendBeacon', done => {
          const exporter2 = new LightstepExporter({
            serviceName: 'bar',
            collectorUrl: 'http://foo.bar.com',
          });
          exporter2.export(spans, function() {});
          setTimeout(() => {
            const args = spyBeacon.args[0];
            const url = args[0];
            const body = args[1];
            const result = JSON.parse(body);
            assert.strictEqual(result.auth.accessToken, undefined);
            assert.ok(result.spans.length === 1);
            assert.strictEqual(result.spans[0].operationName, 'test1');
            assert.strictEqual(url, 'http://foo.bar.com/api/v2/reports');
            assert.strictEqual(spyBeacon.callCount, 1);

            done();
          });
        });
      });
      describe('AND token is available', () => {
        let server: any;
        beforeEach(() => {
          // @ts-ignore
          window.navigator.sendBeacon = false;
          server = sinon.fakeServer.create();
        });
        afterEach(() => {
          server.restore();
        });

        it('should successfully send the spans using XMLHttpRequest', done => {
          exporter.export(spans, function() {});

          setTimeout(() => {
            const request = server.requests[0];
            const url = request.url;
            const body = request.requestBody;

            assertValidPostBody(body);
            assert.strictEqual(url, 'http://foo.bar.com/api/v2/reports');
            assert.strictEqual(spyBeacon.callCount, 0);
            assert.strictEqual(request.method, 'POST');

            done();
          });
        });
      });
    });

    describe('when "sendBeacon" is NOT available', () => {
      let server: any;
      beforeEach(() => {
        // @ts-ignore
        window.navigator.sendBeacon = false;
        server = sinon.fakeServer.create();
      });
      afterEach(() => {
        server.restore();
      });

      it('should successfully send the spans using XMLHttpRequest', done => {
        exporter.export(spans, function() {});

        setTimeout(() => {
          const request = server.requests[0];
          const url = request.url;
          const body = request.requestBody;

          assertValidPostBody(body);
          assert.strictEqual(url, 'http://foo.bar.com/api/v2/reports');
          assert.strictEqual(spyBeacon.callCount, 0);
          assert.strictEqual(request.method, 'POST');

          done();
        });
      });
    });
  });
});
