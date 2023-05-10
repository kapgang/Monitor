// Import the necessary modules
const express = require('express');
const path = require('path');
const child_process = require('child_process');
const http = require('http');
const socketio = require('socket.io');

const scriptProcesses = new Array(5).fill(null);

// Create an express app
const app = express();

// Define a port
const PORT = process.env.PORT || 3005;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server with Express app
const server = http.createServer(app);

// Create new Socket.io instance
const io = socketio(server);

io.on('connection', (socket) => {
//   console.log('New WebSocket connection');
});

// Serve the EJS template
app.get('/', (req, res) => {
    res.render('index');
});

// Start script
app.post('/start/:scriptId', (req, res) => {
    const scriptId = req.params.scriptId;

    if (scriptId < 1 || scriptId > 5) {
        res.status(400).send('Invalid script ID');
        return;
    }

    if (scriptProcesses[scriptId - 1]) {
        res.status(400).send('Script is already running');
        return;
    }

    const scriptPath = path.join(__dirname, 'scripts', `s${scriptId}.js`);
    const scriptProcess = child_process.spawn('node', [scriptPath]);

    scriptProcess.stdout.on('data', (data) => {
        const timestamp = new Date().toLocaleTimeString(); // get current time
        const message = `s${scriptId}.js: ${data}`; // format message
        console.log(`${timestamp} - ${message}`); // log with timestamp
        io.emit('scriptLog', `${timestamp} - ${message}`);
    });

    scriptProcess.stderr.on('data', (data) => {
        console.error(`s${scriptId}.js stderr: ${data}`);
    });

    scriptProcesses[scriptId - 1] = scriptProcess;
    res.status(200).send('Script started');
});

// Stop script
app.post('/stop/:scriptId', (req, res) => {
    const scriptId = req.params.scriptId;

    if (scriptId < 1 || scriptId > 5) {
        res.status(400).send('Invalid script ID');
        return;
    }

    if (!scriptProcesses[scriptId - 1]) {
        res.status(400).send('Script is not running');
        return;
    }

    scriptProcesses[scriptId - 1].kill();
    scriptProcesses[scriptId - 1] = null;
    res.status(200).send('Script stopped');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
