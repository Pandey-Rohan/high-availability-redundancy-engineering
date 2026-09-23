const server1Card = document.querySelector("#server1");
const server2Card = document.querySelector("#server2");

const HISTORY_LENGTH = 20;

// Per-server monitoring state
const state = {
    server1: { history: [], lastStatus: null, requests: 0, latency: null },
    server2: { history: [], lastStatus: null, requests: 0, latency: null }
};

let paused = false;
let pollMs = 3000;
let countdown = pollMs / 1000;
let countdownTimer = null;

function addEvent(message, level) {
    const log = document.getElementById("eventLog");
    const empty = log.querySelector(".event-empty");
    if (empty) empty.remove();

    const li = document.createElement("li");
    li.className = "event " + (level || "info");
    const time = new Date().toLocaleTimeString();
    li.innerHTML = `<span class="event-time">${time}</span> ${message}`;
    log.prepend(li);

    // Keep the log from growing forever
    while (log.children.length > 25) {
        log.removeChild(log.lastChild);
    }
}

function renderHistory(card, history) {
    const container = card.querySelector(".history");
    container.innerHTML = "";
    history.forEach(ok => {
        const dot = document.createElement("span");
        dot.className = "hist-dot " + (ok ? "up" : "down");
        container.appendChild(dot);
    });
}

async function updateServer(card, url, key) {

    const s = state[key];
    const started = performance.now();

    try {

        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            throw new Error("bad status");
        }

        const data = await response.json();
        const elapsed = Math.round(performance.now() - started);

        card.querySelector(".status").innerHTML = "🟢 Healthy";
        card.querySelector(".status").className = "status green";

        card.querySelector(".requests").innerHTML = data.requests;
        card.querySelector(".uptime").innerHTML = data.uptime;
        card.querySelector(".hostname").innerHTML = data.hostname;
        card.querySelector(".latency").innerHTML = elapsed + " ms";

        card.querySelector(".time").innerHTML =
            new Date(data.timestamp).toLocaleTimeString();

        s.requests = data.requests || 0;
        s.latency = elapsed;

        s.history.push(true);
        if (s.lastStatus === false) {
            addEvent(`<b>${key === "server1" ? "Server 1" : "Server 2"}</b> recovered ✅ (responded in ${elapsed} ms)`, "up");
        }
        s.lastStatus = true;

    } catch {

        card.querySelector(".status").innerHTML = "🔴 DOWN";
        card.querySelector(".status").className = "status red";

        card.querySelector(".requests").innerHTML = "-";
        card.querySelector(".uptime").innerHTML = "-";
        card.querySelector(".hostname").innerHTML = "-";
        card.querySelector(".latency").innerHTML = "-";
        card.querySelector(".time").innerHTML = "-";

        s.latency = null;
        s.history.push(false);

        if (s.lastStatus !== false) {
            addEvent(`<b>${key === "server1" ? "Server 1" : "Server 2"}</b> went down ⚠️`, "down");
        }
        s.lastStatus = false;
    }

    if (s.history.length > HISTORY_LENGTH) {
        s.history.shift();
    }

    renderHistory(card, s.history);
}

function updateAggregateStats() {

    const s1 = state.server1;
    const s2 = state.server2;

    const online = [s1.lastStatus, s2.lastStatus].filter(v => v === true).length;
    document.getElementById("statOnline").textContent = `${online} / 2`;

    const totalRequests = (s1.requests || 0) + (s2.requests || 0);
    document.getElementById("statTotalRequests").textContent = totalRequests;

    const latencies = [s1.latency, s2.latency].filter(v => typeof v === "number");
    document.getElementById("statAvgLatency").textContent =
        latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) + " ms" : "-";

    const allChecks = [...s1.history, ...s2.history];
    const upChecks = allChecks.filter(Boolean).length;
    document.getElementById("statUptime").textContent =
        allChecks.length ? Math.round((upChecks / allChecks.length) * 100) + "%" : "-";

    // System status banner
    const banner = document.getElementById("systemStatus");
    const text = document.getElementById("systemStatusText");
    banner.classList.remove("ok", "degraded", "down");

    if (online === 2) {
        banner.classList.add("ok");
        text.textContent = "✅ All Systems Operational";
    } else if (online === 1) {
        banner.classList.add("degraded");
        text.textContent = "⚠️ Degraded — one backend is down, traffic is still being served";
    } else {
        banner.classList.add("down");
        text.textContent = "🔴 Major Outage — both backends are unreachable";
    }

    // Load distribution bar (based on cumulative requests served by each server)
    const total = totalRequests || 1;
    const pct1 = Math.round((s1.requests / total) * 100);
    const pct2 = 100 - pct1;

    const load1 = document.getElementById("loadServer1");
    const load2 = document.getElementById("loadServer2");
    load1.style.width = pct1 + "%";
    load2.style.width = pct2 + "%";
    load1.textContent = totalRequests ? pct1 + "%" : "-";
    load2.textContent = totalRequests ? pct2 + "%" : "-";
}

async function refreshDashboard() {

    await Promise.all([
        updateServer(server1Card, "/api/server1", "server1"),
        updateServer(server2Card, "/api/server2", "server2")
    ]);

    updateAggregateStats();

    document.getElementById("updated").innerHTML =
        "Last Updated : " +
        new Date().toLocaleTimeString();
}

function resetCountdownLabel() {
    countdown = pollMs / 1000;
    document.getElementById("nextCheckLabel").textContent =
        paused ? "Paused" : `Next check in ${countdown}s`;
}

function tickCountdown() {
    if (paused) return;
    countdown -= 1;
    if (countdown <= 0) countdown = pollMs / 1000;
    document.getElementById("nextCheckLabel").textContent = `Next check in ${countdown}s`;
}

let pollTimer = null;

function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => {
        if (!paused) refreshDashboard();
    }, pollMs);

    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tickCountdown, 1000);
    resetCountdownLabel();
}

// --- Controls ---

document.getElementById("pauseBtn").addEventListener("click", (e) => {
    paused = !paused;
    e.target.textContent = paused ? "▶ Resume" : "⏸ Pause";
    resetCountdownLabel();
    addEvent(paused ? "Monitoring paused by user" : "Monitoring resumed", "info");
});

document.getElementById("refreshBtn").addEventListener("click", () => {
    refreshDashboard();
    countdown = pollMs / 1000;
});

document.getElementById("intervalSelect").addEventListener("change", (e) => {
    pollMs = parseInt(e.target.value, 10);
    startPolling();
});

// --- Init ---

refreshDashboard();
startPolling();
