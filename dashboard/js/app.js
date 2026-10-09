document.addEventListener("DOMContentLoaded", () => {
    // Navigation Tab Switching
    const navLinks = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = link.getAttribute("data-tab");

            navLinks.forEach(l => l.classList.remove("active"));
            tabContents.forEach(t => t.classList.remove("active"));

            link.classList.add("active");
            document.getElementById(`tab-${tabId}`).classList.add("active");
            pageTitle.textContent = link.textContent.replace(/^[^\w]+/, "").trim();
        });
    });

    // WebSockets Real-Time Client
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/scan-events`;
    let socket;

    function connectWebSocket() {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("[Gateway WebSockets] Connected to server");
            appendLog("info", "[SYSTEM] Connected to scan events WebSocket endpoint.");
        };

        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                handleScanEvent(payload);
            } catch (err) {
                console.error("Failed to parse WebSocket message", err);
            }
        };

        socket.onclose = () => {
            appendLog("warning", "[SYSTEM] WebSockets disconnected. Retrying in 5 seconds...");
            setTimeout(connectWebSocket, 5000);
        };
    }

    function handleScanEvent(event) {
        if (event.type === "DEVICE_CONNECTED") {
            document.getElementById("device-badge").innerHTML = `<span>⚡ Device Attached: <strong>${event.data.name}</strong></span>`;
            appendLog("info", `[DEVICE] New USB device connected: ${event.data.name}`);
        } else if (event.type === "SCAN_PROGRESS") {
            const progressBar = document.getElementById("scan-progress-bar");
            const statusText = document.getElementById("scan-status-text");
            const percentage = event.data.percentage || 0;

            progressBar.style.width = `${percentage}%`;
            statusText.textContent = `Scanning... ${event.data.current_file} (${percentage}%)`;
        } else if (event.type === "THREAT_ALERT") {
            appendLog("danger", `[THREAT ALERT] File: ${event.data.path} - Action: ${event.data.action} (${event.data.reason})`);
        }
    }

    function appendLog(type, message) {
        const logContainer = document.getElementById("event-log");
        const entry = document.createElement("div");
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Initialize WebSockets connection
    connectWebSocket();
});
