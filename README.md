# opentelemetry-exporter-js
LightStep Exporter for OpenTelemetry JS

### Running in browser
1. Please obtain a token first and edit example/index.js and then run
```bash
    npm run start:browser
```

### Running in node
1. Please obtain a token first and edit example/node.js and then run
```bash
    npm run start
```

### Example in browser

```javascript
'use strict';
import * as opentelemetry from '@opentelemetry/api';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
const { LightstepExporter } = require('lightstep-opentelemetry-exporter');

const provider = new WebTracerProvider({
  scopeManager: new ZoneContextManager(),
});
provider.addSpanProcessor(new SimpleSpanProcessor(new LightstepExporter({
  token: 'YOUR_TOKEN'
})));
provider.register();
const tracer = provider.getTracer('lightstep-exporter-example-web');

const main = tracer.startSpan('main');
main.end();
```

### Example in node

```javascript
'use strict';

const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { LightstepExporter } = require('lightstep-opentelemetry-exporter');

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new LightstepExporter({
  token: 'YOUR_TOKEN'
})));
provider.register();
const tracer = provider.getTracer('lightstep-exporter-example-node');

const main = tracer.startSpan('main');
main.end();

```

### Generating the proto
1. Make sure you have googleapis and lightstep-tracer-common, if not run
```
make clone
```
2. Generate sources
```
make proto
```