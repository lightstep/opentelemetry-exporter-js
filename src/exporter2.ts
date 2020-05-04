import { ExportResult } from '@opentelemetry/base';
import { ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import * as ls from './types2';
import { createReport } from './create-report';
import { PLATFORM, sendSpans2 } from './platform/index';
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
export interface LightstepExporterConfig2 {
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
export class LightstepExporter2 implements SpanExporter {
  private _attributes: { [key: string]: any };
  private _accessToken: string;
  private _createReport: (spans: ReadableSpan[]) => ls.ReportRequest;
  private _serviceName: string;
  private _hostname: string;
  private _runtimeGUID: string;
  private _shutdown = false;
  private _url: string;
  private _version: string;

  constructor(config: LightstepExporterConfig2) {
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
    this._url = `${host}${port ? `:${port}` : ''}${path}`;
    this._accessToken = config.token;
    this._runtimeGUID = config.runtimeGUID || generateLongUUID();
    this._version = VERSION;
    this._serviceName =
      config.serviceName || `${DEFAULT_SERVICE_NAME}-${PLATFORM}`;
    this._hostname = config.hostname || '';
    this._attributes = {
      [Attributes.TRACER_VERSION]: this._version,
      [Attributes.TRACER_PLATFORM]: PLATFORM,
      [Attributes.TRACER_PLATFORM_VERSION]: OTEL_VERSION,
      [Attributes.COMPONENT_NAME]: this._serviceName,
      [Attributes.HOSTNAME]: this._hostname,
    };
    this._createReport = createReport(
      this._runtimeGUID,
      config.token,
      this._attributes
    );
  }

  private _exportSpans(spans: ReadableSpan[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        sendSpans2(
          JSON.stringify(this._createReport(spans)),
          this._accessToken,
          this._url,
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
