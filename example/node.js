'use strict';

const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { OpenTelemetryExporter } = require('../build/src/index');

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(new OpenTelemetryExporter({
  token: 'YOUR_TOKEN'
})));

opentelemetry.trace.initGlobalTracerProvider(provider);
const tracer = provider.getTracer('lightstep-exporter-example-node');

const main = tracer.startSpan('main');
const span = tracer.startSpan('test', {
  parent: main
});
main.setAttribute('atr1', 'test1');
span.setAttribute('atr2', 'test2');
span.addEvent('event 1');
span.addEvent('event 2 with attributes',  {
  'atr1': 'value1',
  'atr2': 'value2',
});

// simulate some random work.
for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
  // empty
}

span.end();
main.end();
