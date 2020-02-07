import * as assert from 'assert';
import { OpenTelemetryExporter } from '../../src';

describe('OpenTelemetryExporter', () => {
  it('should construct exporter', () => {
    const exporter = new OpenTelemetryExporter({
      token: '123',
    });
    assert.ok(exporter instanceof OpenTelemetryExporter);
  });
  it('should throw error for missing config', () => {
    let error;
    try {
      // @ts-ignore
      new OpenTelemetryExporter();
    } catch (e) {
      error = e;
    }
    assert.strictEqual(error, 'Missing config');
  });
  it('should throw error for missing token exporter', () => {
    let error;
    try {
      // @ts-ignore
      new OpenTelemetryExporter({});
    } catch (e) {
      error = e;
    }
    assert.strictEqual(error, 'Missing token');
  });
});
