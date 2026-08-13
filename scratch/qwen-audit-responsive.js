const http = require('http');
const fs = require('fs');
const path = require('path');

const appCss = fs.readFileSync(path.join(__dirname, '../src/App.css'), 'utf8');
const mapJs = fs.readFileSync(path.join(__dirname, '../src/components/MapWidget.js'), 'utf8');

const prompt = `You are a Senior Frontend & Responsive UX Auditor specializing in mobile layout optimization and cross-browser compatibility (Safari, Chrome, Firefox, Edge, Mobile Safari iOS, Android Chrome).

Analyze the provided CSS and JS snippets for the HomeVibes React Web Application.

### Code Snippets:
**App.css (Responsive & Layout Styles):**
${appCss.slice(0, 4000)}

**MapWidget.js (Map Layout):**
${mapJs.slice(0, 3000)}

### Question:
Is the website fully optimized for mobile devices (iPhones, Android, tablets) and cross-browser compatibility (Safari, Chrome, Firefox, Edge)?
Identify any potential mobile overflow, touch event, height chain, or vendor-prefix issues, and outline clear recommendations. Format your analysis cleanly in Markdown.`;

const payload = JSON.stringify({
  model: 'qwen2.5-coder:latest',
  prompt: prompt,
  stream: false
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 11434,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      fs.writeFileSync(path.join(__dirname, '../qwen_responsive_audit.md'), data.response, 'utf8');
      console.log('Qwen Audit Completed! Report saved to qwen_responsive_audit.md');
    } catch (err) {
      console.error('Error parsing response:', err);
    }
  });
});

req.on('error', (err) => console.error('Ollama HTTP error:', err));
req.write(payload);
req.end();
