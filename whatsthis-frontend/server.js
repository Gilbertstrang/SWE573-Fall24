const https = require('https');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('frontend.key'),
  cert: fs.readFileSync('frontend.crt')
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${process.env.VM_IP || 'localhost'}:3000`);
  });
}); 