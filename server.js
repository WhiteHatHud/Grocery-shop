
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Start Python backend
const pythonProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
	cwd: path.join(__dirname, 'backend')
});

pythonProcess.stdout.on('data', (data) => {
	console.log(`Python backend: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
	console.error(`Python backend error: ${data}`);
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Proxy API requests to Python backend
app.use('/api', (req, res) => {
	const apiUrl = `http://localhost:8000${req.url}`;
	req.pipe(require('http').request(apiUrl, {
		method: req.method,
		headers: req.headers
	}, (apiRes) => {
		res.status(apiRes.statusCode);
		apiRes.pipe(res);
	}));
});

// Catch all routes for SPA
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
