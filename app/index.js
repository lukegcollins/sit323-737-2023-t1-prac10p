const express = require('express');
const app = express();
const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const port = 3000;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

// Create a new counter
const lukeCounter = new promClient.Counter({
    name: 'nodejs_app_luke_endpoint_hits',
    help: 'Number of times the /luke endpoint was hit',
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/luke', (req, res) => {
    res.send('Hello from Luke!');
    console.log('Luke was here!');
    lukeCounter.inc();  // Increment the counter
    res.end();
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(promClient.register.metrics());
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
