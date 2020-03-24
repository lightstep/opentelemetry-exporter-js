'use strict';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
const { LightstepExporter } = require('../build/src/index');

const provider = new WebTracerProvider({
  scopeManager: new ZoneContextManager(),
});
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(new LightstepExporter({
  token: 'YOUR_TOKEN'
})));
provider.register();
const tracer = provider.getTracer('lightstep-exporter-example-web');

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