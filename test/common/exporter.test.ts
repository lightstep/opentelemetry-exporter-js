import * as assert from 'assert';
import { LightstepExporter } from '../../src';

describe('LightstepExporter', () => {
  it('should construct exporter with token', () => {
    const exporter = new LightstepExporter({
      token: '123',
    });
    assert.ok(exporter instanceof LightstepExporter);
  });

  it('should provide default config', () => {
    const exporter = new LightstepExporter();
    assert.ok(exporter instanceof LightstepExporter);
  });
});
