const express = require("express");
const os = require("os");

const app = express();

const PORT = 3002;

// Server start time
const startTime = Date.now();

// Request counter
let requestCount = 0;

// Calculate uptime
function getUptime() {
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

// Dashboard
app.get("/", (req, res) => {

    requestCount++;

    res.send(`
<!DOCTYPE html>
<html>

<head>

<title>High Availability Demo</title>

<meta http-equiv="refresh" content="2">

<style>

body{
    margin:0;
    padding:0;
    background:#0f172a;
    font-family:Arial, Helvetica, sans-serif;
    color:white;
}

.container{

    width:700px;
    margin:50px auto;

    background:#1e293b;

    border-radius:15px;

    padding:30px;

    box-shadow:0px 0px 25px rgba(0,0,0,.5);

}

h1{

    text-align:center;

    color:#3b82f6;

}

.subtitle{

    text-align:center;

    color:#94a3b8;

    margin-bottom:30px;

}

.card{

    background:#334155;

    padding:15px;

    margin:15px 0;

    border-radius:10px;

    font-size:22px;

}

.footer{

    text-align:center;

    margin-top:30px;

    color:#94a3b8;

}

</style>

</head>

<body>

<div class="container">

<h1> HIGH AVAILABILITY MONITOR</h1>

<div class="subtitle">

Node.js • Docker • NGINX Load Balancer

</div>

<div class="card">
🖥️ <b>Current Server:</b> Server 2
</div>

<div class="card">
🟢 <b>Status:</b> Healthy
</div>

<div class="card">
📈 <b>Requests Served:</b> ${requestCount}
</div>

<div class="card">
⏱️ <b>Uptime:</b> ${getUptime()}
</div>

<div class="card">
🖥️ <b>Hostname:</b> ${os.hostname()}
</div>

<div class="card">
🌍 <b>Client IP:</b> ${req.ip}
</div>

<div class="card">
🕒 <b>Current Time:</b> ${new Date().toLocaleString()}
</div>

<div class="footer">

Refreshes automatically every 2 seconds

</div>

</div>

</body>

</html>
`);

});

// Health endpoint
app.get("/health", (req, res) => {

    res.status(200).json({

        server: "Server 2",
        status: "Healthy"

    });

});

// API endpoint
app.get("/api", (req, res) => {

    res.json({

        server: "Server 2",
        status: "Healthy",
        requests: requestCount,
        uptime: getUptime(),
        hostname: os.hostname(),
        ip: req.ip,
        timestamp: new Date()

    });

});

app.listen(PORT, "0.0.0.0", () => {

    console.log(` Server 2 running on port ${PORT}`);

});