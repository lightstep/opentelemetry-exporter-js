import * as assert from 'assert';
import { LightstepExporter } from '../../src';

describe('LightstepExporter', () => {
  it('should construct exporter', () => {
    const exporter = new LightstepExporter({
      token: '123',
    });
    assert.ok(exporter instanceof LightstepExporter);
  });
  it('should throw error for missing config', () => {
    let error;
    try {
      // @ts-ignore
      new LightstepExporter();
    } catch (e) {
      error = e;
    }
    assert.strictEqual(error, 'Missing config');
  });
  it('should throw error for missing token exporter', () => {
    let error;
    try {
      // @ts-ignore
      new LightstepExporter({});
    } catch (e) {
      error = e;
    }
    assert.strictEqual(error, 'Missing token');
  });
});
