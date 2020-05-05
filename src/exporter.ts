import { ExportResult } from '@opentelemetry/base';
import { ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import * as ls from './types';
import { createReport } from './create-report';
import { PLATFORM, sendSpans } from './platform/index';
import { generateLongUUID } from './utils';
import { OTEL_VERSION, VERSION } from './version';
import { Attributes } from './enums';

const DEFAULT_SERVICE_NAME = 'otel-lightstep-exporter';
const DEFAULT_SATELLITE_HOST = 'https://collector.lightstep.com';
const DEFAULT_SATELLITE_PORT = '443';
const DEFAULT_SATELLITE_PATH = '/api/v2/reports';

/**
 * Lightstep Exporter Config
 */
export interface LightstepExporterConfig {
  serviceName?: string;
  hostname?: string;
  runtimeGUID?: string;
  token: string;
  collector_host?: string;
  collector_port?: number;
  collector_path?: string;
}

/**
 * Class for exporting spans from OpenTelemetry to LightStep in protobuf format
 */
export class LightstepExporter implements SpanExporter {
  private _createReport: (spans: ReadableSpan[]) => ls.ReportRequest;
  private _sendSpans: (
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) => void;
  private _shutdown = false;

  constructor(config: LightstepExporterConfig) {
    if (!config) {
      throw 'Missing config';
    }
    if (!config.token) {
      throw 'Missing token';
    }
    const host = config.collector_host || DEFAULT_SATELLITE_HOST;
    const port =
      config.collector_port || host.indexOf('https://') === 0
        ? DEFAULT_SATELLITE_PORT
        : '';
    const path = config.collector_path || DEFAULT_SATELLITE_PATH;
    const url = `${host}${port ? `:${port}` : ''}${path}`;
    const attributes = {
      [Attributes.TRACER_VERSION]: VERSION,
      [Attributes.TRACER_PLATFORM]: PLATFORM,
      [Attributes.TRACER_PLATFORM_VERSION]: OTEL_VERSION,
      [Attributes.COMPONENT_NAME]:
        config.serviceName || `${DEFAULT_SERVICE_NAME}-${PLATFORM}`,
      [Attributes.HOSTNAME]: config.hostname || '',
    };
    this._createReport = createReport(
      config.runtimeGUID || generateLongUUID(),
      config.token,
      attributes
    );
    this._sendSpans = sendSpans(config.token, url);
  }

  private _exportSpans(spans: ReadableSpan[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        this._sendSpans(
          JSON.stringify(this._createReport(spans)),
          resolve,
          reject
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * export spans
   * @param spans
   * @param resultCallback
   */
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ) {
    if (this._shutdown) {
      return resultCallback(ExportResult.FAILED_NOT_RETRYABLE);
    }
    this._exportSpans(spans)
      .then(() => {
        resultCallback(ExportResult.SUCCESS);
      })
      .catch((status: number = 0) => {
        if (status < 500) {
          resultCallback(ExportResult.FAILED_NOT_RETRYABLE);
        } else {
          resultCallback(ExportResult.FAILED_RETRYABLE);
        }
      });
  }

  /**
   * shutdown the exporter
   */
  shutdown(): void {
    this._shutdown = true;
  }
}
