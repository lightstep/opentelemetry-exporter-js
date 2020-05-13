import { ExportResult } from '@opentelemetry/base';
import { ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import * as ls from './types';
import { createReportRequestFn } from './create-report-request-fn';
import { PLATFORM, sendSpansFn } from './platform/index';
import { generateLongUUID } from './utils';
import { OTEL_VERSION, VERSION } from './version';
import { Attributes } from './enums';
import * as url from 'url';

const DEFAULT_SERVICE_NAME = 'otel-lightstep-exporter';
const DEFAULT_SATELLITE_PROTOCOL = 'https:';
const DEFAULT_SATELLITE_HOST = 'collector.lightstep.com';
const DEFAULT_SATELLITE_PORT = '443';
const DEFAULT_SATELLITE_PATH = '/api/v2/reports';
const DEFAULT_INGEST_URL = `${DEFAULT_SATELLITE_PROTOCOL}//${DEFAULT_SATELLITE_HOST}:${DEFAULT_SATELLITE_PORT}${DEFAULT_SATELLITE_PATH}`;
/**
 * Lightstep Exporter Config
 */
export interface LightstepExporterConfig {
  serviceName?: string;
  hostname?: string;
  runtimeGUID?: string;
  token?: string;
  collectorUrl?: string;
}

/**
 * Class for exporting spans from OpenTelemetry to LightStep in protobuf format
 */
export class LightstepExporter implements SpanExporter {
  private _createReportRequest: (spans: ReadableSpan[]) => ls.ReportRequest;
  private _sendSpans: (
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) => void;
  private _shutdown = false;

  constructor(config: LightstepExporterConfig = {}) {
    const url = this._urlFromConfig(config);
    const attributes = {
      [Attributes.TRACER_VERSION]: VERSION,
      [Attributes.TRACER_PLATFORM]: PLATFORM,
      [Attributes.TRACER_PLATFORM_VERSION]: OTEL_VERSION,
      [Attributes.COMPONENT_NAME]:
        config.serviceName || `${DEFAULT_SERVICE_NAME}-${PLATFORM}`,
      [Attributes.HOSTNAME]: config.hostname || '',
    };
    this._createReportRequest = createReportRequestFn(
      config.runtimeGUID || generateLongUUID(),
      attributes,
      config.token
    );
    this._sendSpans = sendSpansFn(url, config.token);
  }

  private _urlFromConfig(config: LightstepExporterConfig) {
    if (!config.collectorUrl) {
      return DEFAULT_INGEST_URL;
    }

    if (!config.collectorUrl.startsWith('http'))
      config.collectorUrl = `${DEFAULT_SATELLITE_PROTOCOL}//${config.collectorUrl}`;

    const parsedUrl = url.parse(config.collectorUrl);
    const protocol = parsedUrl.protocol || DEFAULT_SATELLITE_PROTOCOL;
    const host = parsedUrl.hostname || DEFAULT_SATELLITE_HOST;
    const port =
      parsedUrl.port || (protocol === 'https:' ? DEFAULT_SATELLITE_PORT : '');
    const path =
      !parsedUrl.path || parsedUrl.path === '/'
        ? DEFAULT_SATELLITE_PATH
        : parsedUrl.path;

    return `${protocol}//${host}${port ? `:${port}` : ''}${path}`;
  }

  private _exportSpans(spans: ReadableSpan[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        const reportRequest: ls.ReportRequest = this._createReportRequest(
          spans
        );
        this._sendSpans(JSON.stringify(reportRequest), resolve, reject);
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
