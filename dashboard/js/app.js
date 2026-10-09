document.addEventListener("DOMContentLoaded", () => {
    // UI Containers
    const landingPage = document.getElementById("landing-page");
    const dashboardApp = document.getElementById("dashboard-app");
    const interfaceSelection = document.getElementById("interface-selection");
    const detectionRadar = document.getElementById("detection-radar");
    const radarStatusText = document.getElementById("radar-status-text");
    const discoveredDevice = document.getElementById("discovered-device");
    const deviceIcon = document.getElementById("device-icon");
    const deviceName = document.getElementById("device-name");
    const deviceDetails = document.getElementById("device-details");
    const btnOpenDashboard = document.getElementById("btn-open-dashboard");
    const btnSwitchDevice = document.getElementById("btn-switch-device");
    const btnRunDemo = document.getElementById("btn-run-demo");
    const deviceBadge = document.getElementById("device-badge");

    // Nav Links & Tabs
    const navLinks = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    let currentSelectedType = "usb";
    let activeDeviceData = null;

    // Preset Raspberry Pi Gateway Connections
    const gatewayPresets = {
        usb: {
            icon: "🔌",
            name: "Raspberry Pi 5 Gateway (USB Port Connection)",
            details: "Hardware: Raspberry Pi 5 | Bus: udev Monitored | Mode: Read-Only OverlayFS",
            badge: "🍓 RPi USB Gateway (Online)"
        },
        wifi: {
            icon: "📶",
            name: "Raspberry Pi 5 Gateway (WiFi AP: 192.168.4.1)",
            details: "Host IP: 192.168.4.1 | Channel: 5GHz WPA3 | Mode: Encrypted Network Stream",
            badge: "🍓 RPi WiFi AP: 192.168.4.1"
        },
        bluetooth: {
            icon: "📡",
            name: "Raspberry Pi 5 Gateway (Bluetooth OBEX Channel)",
            details: "Device: RPi5_Security_Gateway | Protocol: BlueZ OBEX v5.3 | Mode: Paired",
            badge: "🍓 RPi Bluetooth Paired"
        }
    };

    // Handle Interface Card Click
    const interfaceCards = document.querySelectorAll(".interface-card");
    interfaceCards.forEach(card => {
        card.addEventListener("click", () => {
            currentSelectedType = card.getAttribute("data-type");
            startDeviceDetection(currentSelectedType);
        });
    });

    function startDeviceDetection(type) {
        interfaceSelection.classList.add("hidden");
        detectionRadar.classList.remove("hidden");
        discoveredDevice.classList.add("hidden");

        const labels = {
            usb: "Establishing direct hardware handshake with Raspberry Pi USB gateway interface...",
            wifi: "Connecting to Raspberry Pi Gateway WiFi Access Point (192.168.4.1)...",
            bluetooth: "Initiating Bluetooth pairing protocol with Raspberry Pi Gateway (BlueZ OBEX)..."
        };

        radarStatusText.textContent = labels[type] || "Connecting to Raspberry Pi Gateway...";

        // Simulate 2.5 second hardware connection delay
        setTimeout(() => {
            const preset = gatewayPresets[type];
            activeDeviceData = preset;
            deviceIcon.textContent = preset.icon;
            deviceName.textContent = preset.name;
            deviceDetails.textContent = preset.details;

            radarStatusText.textContent = "⚡ Successfully Connected to Raspberry Pi Security Gateway!";
            discoveredDevice.classList.remove("hidden");
        }, 2500);
    }

    // Open Dashboard Button
    btnOpenDashboard.addEventListener("click", () => {
        landingPage.classList.add("hidden");
        dashboardApp.classList.remove("hidden");

        if (activeDeviceData) {
            deviceBadge.innerHTML = `<span>${activeDeviceData.badge}</span>`;
            appendLog("success", `[GATEWAY CONNECTED] Host: ${activeDeviceData.name}`);
        }
    });

    // Switch / Reconnect Device Button
    btnSwitchDevice.addEventListener("click", () => {
        dashboardApp.classList.add("hidden");
        landingPage.classList.remove("hidden");
        interfaceSelection.classList.remove("hidden");
        detectionRadar.classList.add("hidden");
    });

    // Navigation Tab Switching
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

    // Interactive Live Demo Scan Simulation
    let isDemoRunning = false;
    btnRunDemo.addEventListener("click", () => {
        if (isDemoRunning) return;
        runFullDemoScan();
    });

    function runFullDemoScan() {
        isDemoRunning = true;
        btnRunDemo.disabled = true;
        btnRunDemo.textContent = "⏳ Scanning Media on RPi...";

        const progressBar = document.getElementById("scan-progress-bar");
        const statusText = document.getElementById("scan-status-text");
        const resultsTable = document.getElementById("results-table-body");
        const quarantineTable = document.getElementById("quarantine-table-body");
        const auditList = document.getElementById("audit-list");

        resultsTable.innerHTML = "";
        quarantineTable.innerHTML = "";

        const mockFiles = [
            { path: "/mnt/source_ro/annual_report_2026.pdf", size: "1.4 MB", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", type: "application/pdf", tts: 0, action: "ALLOW" },
            { path: "/mnt/source_ro/gateway_architecture_diagram.png", size: "2.8 MB", hash: "8f4e3c2b1a0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4", type: "image/png", tts: 5, action: "ALLOW" },
            { path: "/mnt/source_ro/confidential_backup.zip", size: "18.5 MB", hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8", type: "application/zip", tts: 45, action: "QUARANTINE", reason: "Encrypted archive header / Anomaly flag" },
            { path: "/mnt/source_ro/system_patch_update.exe", size: "4.2 MB", hash: "27c346894c0a525287b32524a87c1d7e2e850b6a95f5c9e1e2d3c4b5a6f7e8d", type: "application/x-dosexec", tts: 100, action: "BLOCK", reason: "ClamAV Signature Hit: Win32.Trojan.Agent-1049" }
        ];

        appendLog("info", "[STAGE 1] Raspberry Pi udev detected media insertion. Initializing session #GW-8842...");
        appendLog("info", "[STAGE 2] Mount Isolation: Read-Only OverlayFS established on RPi RAM tmpfs (/mnt/overlay_tmp)");

        let step = 0;
        const totalSteps = mockFiles.length;

        const interval = setInterval(() => {
            step++;
            const pct = Math.round((step / totalSteps) * 100);
            const currentFile = mockFiles[step - 1];

            progressBar.style.width = `${pct}%`;
            statusText.textContent = `Scanning on Raspberry Pi (${pct}%): ${currentFile.path}`;

            // Append File Result
            const row = document.createElement("tr");
            let badgeClass = currentFile.action.toLowerCase();
            row.innerHTML = `
                <td><code>${currentFile.path}</code></td>
                <td>${currentFile.size}</td>
                <td><code>${currentFile.hash.substring(0, 16)}...</code></td>
                <td>${currentFile.type}</td>
                <td><strong>${currentFile.tts}/100</strong></td>
                <td><span class="badge-status ${badgeClass}">${currentFile.action}</span></td>
            `;
            resultsTable.appendChild(row);

            // Log details
            if (currentFile.action === "ALLOW") {
                appendLog("success", `[STAGE 8: ALLOW] Clean file verified on RPi: ${currentFile.path}`);
            } else if (currentFile.action === "QUARANTINE") {
                appendLog("warning", `[STAGE 8: QUARANTINE] Anomaly flag (${currentFile.reason}): ${currentFile.path}`);
                addQuarantineRow(currentFile);
            } else if (currentFile.action === "BLOCK") {
                appendLog("danger", `[STAGE 8: BLOCK] Threat blocked by RPi gateway (${currentFile.reason}): ${currentFile.path}`);
            }

            // Update Metrics
            document.getElementById("metric-sessions").textContent = "1";
            document.getElementById("metric-files").textContent = step;
            document.getElementById("metric-quarantine").textContent = mockFiles.filter(f => f.action === "QUARANTINE" && mockFiles.indexOf(f) < step).length;
            document.getElementById("metric-blocked").textContent = mockFiles.filter(f => f.action === "BLOCK" && mockFiles.indexOf(f) < step).length;

            if (step >= totalSteps) {
                clearInterval(interval);
                isDemoRunning = false;
                btnRunDemo.disabled = false;
                btnRunDemo.textContent = "▶️ Run Live Demo Scan";
                statusText.textContent = "✅ Scan Complete - Media Inspection Finished on Raspberry Pi";
                appendLog("info", "[STAGE 9] Audit log committed to SQLite database on Raspberry Pi. Session completed.");

                // Add to audit list
                const auditEntry = document.createElement("div");
                auditEntry.className = "audit-item";
                auditEntry.innerHTML = `<span class="badge info">SESSION</span> <span>[Session #GW-8842] RPi Scan Finished: 4 files inspected (2 Clean, 1 Quarantined, 1 Blocked)</span>`;
                auditList.prepend(auditEntry);
            }
        }, 1200);
    }

    function addQuarantineRow(file) {
        const quarantineTable = document.getElementById("quarantine-table-body");
        const qRow = document.createElement("tr");
        qRow.innerHTML = `
            <td><code>${file.path.split('/').pop()}</code></td>
            <td>${file.reason}</td>
            <td><strong>${file.tts}</strong></td>
            <td><code>/mnt/quarantine/${file.hash.substring(0, 12)}_${file.path.split('/').pop()}</code></td>
        `;
        quarantineTable.appendChild(qRow);
    }

    function appendLog(type, message) {
        const logContainer = document.getElementById("event-log");
        const entry = document.createElement("div");
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
});
