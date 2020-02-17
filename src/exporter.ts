import { ExportResult } from '@opentelemetry/base';
import { ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import { toSpan, toBuffer, createAuthProto } from './transform';
import { PLATFORM, sendSpans } from './platform/index';
import { generateLongUUID } from './utils';
import { OTEL_VERSION, VERSION } from './version';
import * as lsTypes from './types';
import { Attributes } from './enums';

const DEFAULT_SERVICE_NAME = 'otel-lightstep-exporter';
const DEFAULT_SATELLITE_HOST = 'https://collector.lightstep.com';
const DEFAULT_SATELLITE_PORT = '443';
const DEFAULT_SATELLITE_PATH = '/api/v2/reports';
const DEFAULT_URL = `${DEFAULT_SATELLITE_HOST}:${DEFAULT_SATELLITE_PORT}${DEFAULT_SATELLITE_PATH}`;

/**
 * Lightstep Exporter Config
 */
export interface LightstepExporterConfig {
  serviceName?: string;
  hostname?: string;
  runtimeGUID?: string;
  token: string;
  url?: string;
}

/**
 * Class for exporting spans from OpenTelemetry to LightStep in protobuf format
 */
export class LightstepExporter implements SpanExporter {
  private _attributes: { [key: string]: any };
  private _authProto: lsTypes.AuthProto;
  private _serviceName: string;
  private _hostname: string;
  private _runtimeGUID: string;
  private _shutdown = false;
  private _url: string;
  private _version: string;

  constructor(config: LightstepExporterConfig) {
    if (!config) {
      throw 'Missing config';
    }
    if (!config.token) {
      throw 'Missing token';
    }
    this._url = config.url || DEFAULT_URL;
    this._authProto = createAuthProto(config.token);
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
  }

  private _exportSpans(spans: ReadableSpan[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        const startTime = spans[0].startTime;
        const spansToBeSent: lsTypes.SpanProto[] = spans.map(span =>
          toSpan(span)
        );
        const body = toBuffer(
          this._runtimeGUID,
          this._serviceName,
          this._version,
          this._attributes,
          this._authProto,
          startTime,
          spansToBeSent
        );

        sendSpans(body, this._url, resolve, reject);
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
