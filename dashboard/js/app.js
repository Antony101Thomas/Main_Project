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
    let activeConnectionData = null;

    // Connection Methods
    const connectionPresets = {
        usb: {
            icon: "🔌",
            name: "Wired USB Connection (USB-A / USB-C)",
            details: "Connection: Wired USB Cable Interface | Speed: High-Speed | Status: Active",
            badge: "🔌 Connected via Wired USB"
        },
        wifi: {
            icon: "📶",
            name: "WiFi Network Connection",
            details: "Connection: WiFi Network Interface | Protocol: WPA3 Encrypted | Status: Active",
            badge: "📶 Connected via WiFi"
        },
        bluetooth: {
            icon: "📡",
            name: "Bluetooth Wireless Connection",
            details: "Connection: Bluetooth Interface | Profile: Paired OBEX Channel | Status: Active",
            badge: "📡 Connected via Bluetooth"
        }
    };

    // Handle Interface Card Click
    const interfaceCards = document.querySelectorAll(".interface-card");
    interfaceCards.forEach(card => {
        card.addEventListener("click", () => {
            currentSelectedType = card.getAttribute("data-type");
            startGatewayConnection(currentSelectedType);
        });
    });

    function startGatewayConnection(type) {
        interfaceSelection.classList.add("hidden");
        detectionRadar.classList.remove("hidden");
        discoveredDevice.classList.add("hidden");

        const labels = {
            usb: "Connecting to Hardware Security Gateway via Wired USB (Type-A / Type-C)...",
            wifi: "Connecting to Hardware Security Gateway using WiFi...",
            bluetooth: "Establishing connection to Hardware Security Gateway via Bluetooth..."
        };

        radarStatusText.textContent = labels[type] || "Connecting to Hardware Security Gateway...";

        // Simulate 2.5 second connection setup delay
        setTimeout(() => {
            const preset = connectionPresets[type];
            activeConnectionData = preset;
            deviceIcon.textContent = preset.icon;
            deviceName.textContent = preset.name;
            deviceDetails.textContent = preset.details;

            radarStatusText.textContent = "⚡ Successfully Connected to Hardware Security Gateway!";
            discoveredDevice.classList.remove("hidden");
        }, 2500);
    }

    // Open Dashboard Button
    btnOpenDashboard.addEventListener("click", () => {
        landingPage.classList.add("hidden");
        dashboardApp.classList.remove("hidden");

        if (activeConnectionData) {
            deviceBadge.innerHTML = `<span>${activeConnectionData.badge}</span>`;
            appendLog("success", `[GUI CONNECTED] Established session via ${activeConnectionData.name}`);
        }
    });

    // Switch / Reconnect Connection Button
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

    // Interactive 9-Stage Demo Scan Simulation
    let isDemoRunning = false;
    btnRunDemo.addEventListener("click", () => {
        if (isDemoRunning) return;
        runFullDemoScan();
    });

    function runFullDemoScan() {
        isDemoRunning = true;
        btnRunDemo.disabled = true;
        btnRunDemo.textContent = "⏳ Running 9-Stage Inspection...";

        const progressBar = document.getElementById("scan-progress-bar");
        const statusText = document.getElementById("scan-status-text");
        const resultsTable = document.getElementById("results-table-body");
        const quarantineTable = document.getElementById("quarantine-table-body");
        const auditList = document.getElementById("audit-list");

        resultsTable.innerHTML = "";
        quarantineTable.innerHTML = "";

        const mockFiles = [
            { path: "/mnt/source_ro/project_proposal.pdf", size: "1.4 MB", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", type: "application/pdf", tts: 0, action: "ALLOW" },
            { path: "/mnt/source_ro/system_architecture.png", size: "2.8 MB", hash: "8f4e3c2b1a0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4", type: "image/png", tts: 5, action: "ALLOW" },
            { path: "/mnt/source_ro/encrypted_backup.zip", size: "18.5 MB", hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8", type: "application/zip", tts: 45, action: "QUARANTINE", reason: "Extension Mismatch / Suspect Archive Depth" },
            { path: "/mnt/source_ro/firmware_update.exe", size: "4.2 MB", hash: "27c346894c0a525287b32524a87c1d7e2e850b6a95f5c9e1e2d3c4b5a6f7e8d", type: "application/x-dosexec", tts: 100, action: "BLOCK", reason: "ClamAV Signature Hit: Win32.Trojan.Agent-1049" }
        ];

        appendLog("info", "[STAGE 1] Device Detection: pyudev registered media insertion. Session #GW-9041 created.");
        appendLog("info", "[STAGE 2] Read-Only Mount: Source mounted ro at /mnt/source_ro; OverlayFS RAM workspace linked.");

        let step = 0;
        const totalSteps = mockFiles.length;

        const interval = setInterval(() => {
            step++;
            const pct = Math.round((step / totalSteps) * 100);
            const currentFile = mockFiles[step - 1];

            progressBar.style.width = `${pct}%`;
            statusText.textContent = `Scanning (${pct}%): Stage ${step + 2}/9 - Inspecting ${currentFile.path}`;

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
                appendLog("success", `[STAGE 8: ALLOW] Verified safe: ${currentFile.path} (TTS = ${currentFile.tts})`);
            } else if (currentFile.action === "QUARANTINE") {
                appendLog("warning", `[STAGE 8: QUARANTINE] Isolated to Quarantine SSD (${currentFile.reason}): ${currentFile.path}`);
                addQuarantineRow(currentFile);
            } else if (currentFile.action === "BLOCK") {
                appendLog("danger", `[STAGE 8: BLOCK] Malicious threat denied access (${currentFile.reason}): ${currentFile.path}`);
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
                btnRunDemo.textContent = "▶️ Run 9-Stage Demo Scan";
                statusText.textContent = "✅ Stage 9 Complete - Audit log saved to SQLite WAL database";
                appendLog("info", "[STAGE 9] Logging & Dashboard: Scan session complete. Audit recorded in SQLite WAL.");

                // Add to audit list
                const auditEntry = document.createElement("div");
                auditEntry.className = "audit-item";
                auditEntry.innerHTML = `<span class="badge info">SESSION</span> <span>[Session #GW-9041] 9-Stage Pipeline Complete: 4 files evaluated (2 ALLOW, 1 QUARANTINE, 1 BLOCK)</span>`;
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
