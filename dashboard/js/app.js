document.addEventListener("DOMContentLoaded", () => {
    // UI Containers
    const loginPage = document.getElementById("login-page");
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

    // Login Form Elements
    const loginForm = document.getElementById("login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const emailValidIcon = document.getElementById("email-valid-icon");
    const emailStatusLabel = document.getElementById("email-status-label");
    const btnTogglePassword = document.getElementById("btn-toggle-password");
    const eyeIcon = document.getElementById("eye-icon");
    const btnLoginSubmit = document.getElementById("btn-login-submit");
    const loginAlert = document.getElementById("login-alert");
    const btnAutofillCreds = document.getElementById("btn-autofill-creds");
    const linkForgotPassword = document.getElementById("link-forgot-password");

    // Password Reset Modal Elements
    const resetModal = document.getElementById("reset-modal");
    const btnCloseResetModal = document.getElementById("btn-close-reset-modal");
    const btnCancelReset = document.getElementById("btn-cancel-reset");
    const btnSendResetPin = document.getElementById("btn-send-reset-pin");
    const resetEmail = document.getElementById("reset-email");
    const resetStatus = document.getElementById("reset-status");

    // Session Management Elements
    const btnLockSession = document.getElementById("btn-lock-session");
    const btnSidebarLogout = document.getElementById("btn-sidebar-logout");
    const sidebarUserEmail = document.getElementById("sidebar-user-email");

    // Nav Links & Tabs
    const navLinks = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    let currentSelectedType = "usb";
    let activeConnectionData = null;

    // =========================================================================
    // THEME MANAGEMENT (LIGHT / DARK CYBER HUD)
    // =========================================================================

    const btnFloatingThemeToggle = document.getElementById("btn-floating-theme-toggle");
    const btnThemeToggle = document.getElementById("btn-theme-toggle");

    let currentTheme = localStorage.getItem("gateway-cyber-theme") || "dark";

    function applyTheme(theme) {
        currentTheme = theme;
        localStorage.setItem("gateway-cyber-theme", theme);

        const isLight = theme === "light";
        document.body.classList.toggle("light-theme", isLight);
        document.documentElement.setAttribute("data-theme", theme);

        // Update floating toggle button
        if (btnFloatingThemeToggle) {
            const icon = btnFloatingThemeToggle.querySelector(".theme-toggle-icon");
            const label = btnFloatingThemeToggle.querySelector(".theme-toggle-label");
            if (icon) icon.textContent = isLight ? "🌙" : "☀️";
            if (label) label.textContent = isLight ? "DARK MODE" : "LIGHT MODE";
        }

        // Update header toggle button
        if (btnThemeToggle) {
            const icon = btnThemeToggle.querySelector(".theme-icon");
            const label = btnThemeToggle.querySelector(".theme-text");
            if (icon) icon.textContent = isLight ? "🌙" : "☀️";
            if (label) label.textContent = isLight ? "DARK" : "LIGHT";
        }
    }

    function toggleTheme() {
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    }

    if (btnFloatingThemeToggle) {
        btnFloatingThemeToggle.addEventListener("click", toggleTheme);
    }
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener("click", toggleTheme);
    }

    // Apply saved theme on initial load
    applyTheme(currentTheme);

    // =========================================================================
    // CYBER ACCESS CLEARANCE & AUTHENTICATION
    // =========================================================================

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    // Real-time Email Validation with Holographic Badge Update
    if (loginEmail && emailValidIcon) {
        const checkEmailInput = () => {
            if (isValidEmail(loginEmail.value)) {
                emailValidIcon.classList.remove("hidden");
                if (emailStatusLabel) {
                    emailStatusLabel.textContent = "IDENTITY VALIDATED";
                    emailStatusLabel.style.color = "var(--emerald-neon)";
                }
            } else {
                emailValidIcon.classList.add("hidden");
                if (emailStatusLabel) {
                    emailStatusLabel.textContent = "AWAITING CREDENTIAL";
                    emailStatusLabel.style.color = "var(--cyan-neon)";
                }
            }
        };

        loginEmail.addEventListener("input", checkEmailInput);
        // Initial check if pre-filled
        checkEmailInput();
    }

    // Toggle Password Visibility with Morphing Cyber Eye Icon
    let isPasswordRevealed = false;
    if (btnTogglePassword && loginPassword && eyeIcon) {
        btnTogglePassword.addEventListener("click", () => {
            isPasswordRevealed = !isPasswordRevealed;
            loginPassword.type = isPasswordRevealed ? "text" : "password";

            if (isPasswordRevealed) {
                // Eye-Off Icon
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
                btnTogglePassword.style.color = "var(--cyan-neon)";
            } else {
                // Normal Eye Icon
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
                btnTogglePassword.style.color = "var(--text-dim)";
            }
        });
    }

    // Demo Autofill Button with Feedback
    if (btnAutofillCreds && loginEmail && loginPassword) {
        btnAutofillCreds.addEventListener("click", () => {
            loginEmail.value = "admin@gateway.sec";
            loginPassword.value = "admin123";
            if (emailValidIcon) emailValidIcon.classList.remove("hidden");
            if (emailStatusLabel) {
                emailStatusLabel.textContent = "DEMO PRESET LOADED";
                emailStatusLabel.style.color = "var(--emerald-neon)";
            }
            showLoginAlert("success", "[SYSTEM] Demo security clearance loaded. Initialize access to proceed.");
        });
    }

    function showLoginAlert(type, message) {
        if (!loginAlert) return;
        loginAlert.className = `cyber-alert ${type}`;
        loginAlert.textContent = message;
        loginAlert.classList.remove("hidden");
    }

    // Login Form Submit Handling
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            if (!isValidEmail(email)) {
                showLoginAlert("error", "[ERROR 401] Invalid operator format. Verification aborted.");
                loginEmail.focus();
                return;
            }

            if (!password || password.length < 4) {
                showLoginAlert("error", "[ERROR 403] Security token length insufficient (min 4 characters required).");
                loginPassword.focus();
                return;
            }

            // Interactive Button Loading State
            btnLoginSubmit.disabled = true;
            const btnText = btnLoginSubmit.querySelector(".btn-text");
            const btnSpinner = btnLoginSubmit.querySelector(".btn-spinner");
            if (btnText) btnText.textContent = "VERIFYING CRYPTOGRAPHIC TOKEN...";
            if (btnSpinner) btnSpinner.classList.remove("hidden");

            // Simulate verification delay
            setTimeout(() => {
                if (btnText) btnText.textContent = "INITIALIZE GATEWAY ACCESS";
                if (btnSpinner) btnSpinner.classList.add("hidden");
                btnLoginSubmit.disabled = false;

                // Update session state in dashboard
                if (sidebarUserEmail) {
                    sidebarUserEmail.textContent = email;
                }

                showLoginAlert("success", "[CLEARED] Clearance Level 4 Verified. Mounting peripheral bus...");

                // Smooth fade-out and transition to Gateway Connection screen
                setTimeout(() => {
                    loginPage.classList.add("fade-out");
                    setTimeout(() => {
                        loginPage.classList.add("hidden");
                        landingPage.classList.remove("hidden");
                        loginAlert.classList.add("hidden");
                    }, 450);
                }, 500);
            }, 850);
        });
    }

    // Forgot Password Modal Handlers
    if (linkForgotPassword && resetModal) {
        linkForgotPassword.addEventListener("click", (e) => {
            e.preventDefault();
            resetModal.classList.remove("hidden");
            if (resetStatus) resetStatus.classList.add("hidden");
        });

        const hideResetModal = () => {
            resetModal.classList.add("hidden");
        };

        if (btnCloseResetModal) btnCloseResetModal.addEventListener("click", hideResetModal);
        if (btnCancelReset) btnCancelReset.addEventListener("click", hideResetModal);

        resetModal.addEventListener("click", (e) => {
            if (e.target === resetModal) hideResetModal();
        });

        if (btnSendResetPin && resetEmail && resetStatus) {
            btnSendResetPin.addEventListener("click", () => {
                const email = resetEmail.value.trim();
                if (!isValidEmail(email)) {
                    resetStatus.className = "reset-status error";
                    resetStatus.textContent = "[ALERT] Invalid operator identifier.";
                    resetStatus.classList.remove("hidden");
                    return;
                }

                btnSendResetPin.disabled = true;
                btnSendResetPin.textContent = "GENERATING TOKEN...";

                setTimeout(() => {
                    btnSendResetPin.disabled = false;
                    btnSendResetPin.textContent = "GENERATE OVERRIDE TOKEN";
                    resetStatus.className = "reset-status success";
                    resetStatus.innerHTML = `Isolated override token issued for <strong>${email}</strong>: <code>#AUTH-TOKEN-7729</code>`;
                    resetStatus.classList.remove("hidden");
                }, 750);
            });
        }
    }

    // Session Locking / Logout Handler
    function lockGatewaySession() {
        dashboardApp.classList.add("hidden");
        landingPage.classList.add("hidden");
        loginPage.classList.remove("hidden");
        loginPage.classList.remove("fade-out");
        showLoginAlert("error", "[TERMINAL LOCKED] Hardware interface locked. Re-authentication mandated.");
    }

    if (btnLockSession) btnLockSession.addEventListener("click", lockGatewaySession);
    if (btnSidebarLogout) btnSidebarLogout.addEventListener("click", lockGatewaySession);

    // =========================================================================
    // PERIPHERAL PROTOCOL INTERFACING
    // =========================================================================

    const connectionPresets = {
        usb: {
            icon: "🔌",
            name: "Wired USB Direct Channel (USB-A / USB-C)",
            details: "Protocol: OTG Direct Bus | Transfer: High-Speed 480 Mbps | Jitter: < 1ms",
            badge: "⚡ WIRED USB GATEWAY [480 Mbps]"
        },
        wifi: {
            icon: "📶",
            name: "Encrypted WiFi-6 Network Channel",
            details: "Protocol: 802.11ax / WPA3-SAE Hardware Handshake | Band: 5 GHz | Latency: 4ms",
            badge: "📶 ENCRYPTED WIFI-6 [WPA3-SAE]"
        },
        bluetooth: {
            icon: "📡",
            name: "Bluetooth BLE Tactical OBEX Profile",
            details: "Protocol: BLE 5.4 Isolated OBEX Channel | Range: Near-Field | Power: Ultra-Low",
            badge: "📡 BLUETOOTH BLE [OBEX-SEC]"
        }
    };

    // Handle Interface Card Click
    const interfaceCards = document.querySelectorAll(".cyber-interface-tile");
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
            usb: "NEGOTIATING WIRED USB BUS PROTOCOL (OTG DIRECT)...",
            wifi: "PERFORMING WPA3-SAE CRYPTOGRAPHIC HANDSHAKE...",
            bluetooth: "ESTABLISHING BLE ISOLATED OBEX SECURE PAIRING..."
        };

        radarStatusText.textContent = labels[type] || "NEGOTIATING PERIPHERAL PROTOCOL...";

        // Simulate connection setup delay
        setTimeout(() => {
            const preset = connectionPresets[type];
            activeConnectionData = preset;
            deviceIcon.textContent = preset.icon;
            deviceName.textContent = preset.name.toUpperCase();
            deviceDetails.textContent = preset.details;

            radarStatusText.textContent = "⚡ HARDWARE GATEWAY PERIPHERAL LINK ESTABLISHED";
            discoveredDevice.classList.remove("hidden");
        }, 2200);
    }

    // Open Dashboard Button
    btnOpenDashboard.addEventListener("click", () => {
        landingPage.classList.add("hidden");
        dashboardApp.classList.remove("hidden");

        if (activeConnectionData) {
            deviceBadge.innerHTML = `<span>${activeConnectionData.badge}</span>`;
            appendLog("success", `[SOCKET LINK] Established hardware communications channel via ${activeConnectionData.name}`);
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
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) targetTab.classList.add("active");
            
            const linkText = link.querySelector(".nav-text") 
                ? link.querySelector(".nav-text").textContent 
                : link.textContent.trim();
            pageTitle.textContent = linkText;
        });
    });

    // =========================================================================
    // REAL-TIME 9-STAGE CIRCUIT STEPPER & INSPECTION ENGINE
    // =========================================================================

    let isDemoRunning = false;
    btnRunDemo.addEventListener("click", () => {
        if (isDemoRunning) return;
        runFullDemoScan();
    });

    function formatStageNum(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    function updateStageStepper(activeStageNum) {
        for (let i = 1; i <= 9; i++) {
            const node = document.getElementById(`stage-node-${i}`);
            const connector = document.getElementById(`connector-${i}`);

            if (node) {
                node.classList.remove("active", "completed");
                const circle = node.querySelector(".node-circle");
                if (i < activeStageNum) {
                    node.classList.add("completed");
                    if (circle) circle.textContent = "✓";
                } else if (i === activeStageNum) {
                    node.classList.add("active");
                    if (circle) circle.textContent = formatStageNum(i);
                } else {
                    if (circle) circle.textContent = formatStageNum(i);
                }
            }

            if (connector) {
                connector.classList.remove("active", "completed");
                if (i < activeStageNum) {
                    connector.classList.add("completed");
                } else if (i === activeStageNum) {
                    connector.classList.add("active");
                }
            }
        }
    }

    function runFullDemoScan() {
        isDemoRunning = true;
        btnRunDemo.disabled = true;
        btnRunDemo.textContent = "⏳ INSPECTION IN PROGRESS...";

        const progressBar = document.getElementById("scan-progress-bar");
        const statusText = document.getElementById("scan-status-text");
        const scanBadge = document.getElementById("scan-badge");
        const resultsTable = document.getElementById("results-table-body");
        const quarantineTable = document.getElementById("quarantine-table-body");
        const auditList = document.getElementById("audit-list");

        if (scanBadge) {
            scanBadge.textContent = "STATUS: INSPECTING [STAGE 01]";
            scanBadge.className = "scan-state-badge active";
        }

        resultsTable.innerHTML = "";
        quarantineTable.innerHTML = "";

        const mockFiles = [
            { path: "/mnt/source_ro/project_proposal.pdf", size: "1.4 MB", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", type: "application/pdf", tts: 0, action: "ALLOW" },
            { path: "/mnt/source_ro/system_architecture.png", size: "2.8 MB", hash: "8f4e3c2b1a0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4", type: "image/png", tts: 5, action: "ALLOW" },
            { path: "/mnt/source_ro/encrypted_backup.zip", size: "18.5 MB", hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8", type: "application/zip", tts: 45, action: "QUARANTINE", reason: "Extension Mismatch / Suspect Archive Depth" },
            { path: "/mnt/source_ro/firmware_update.exe", size: "4.2 MB", hash: "27c346894c0a525287b32524a87c1d7e2e850b6a95f5c9e1e2d3c4b5a6f7e8d", type: "application/x-dosexec", tts: 100, action: "BLOCK", reason: "ClamAV Signature Hit: Win32.Trojan.Agent-1049" }
        ];

        // Stage 1 & 2 setup
        updateStageStepper(1);
        appendLog("info", "[STAGE 1: UDEV] Device Detection: pyudev registered removable media insertion. Session #GW-9041 created.");

        setTimeout(() => {
            updateStageStepper(2);
            if (scanBadge) scanBadge.textContent = "STATUS: INSPECTING [STAGE 02]";
            appendLog("info", "[STAGE 2: MOUNT] Kernel Read-Only: Source partition bound ro at /mnt/source_ro; OverlayFS volatile RAM tmpfs active.");
        }, 600);

        setTimeout(() => {
            updateStageStepper(3);
            if (scanBadge) scanBadge.textContent = "STATUS: INSPECTING [STAGE 03]";
            appendLog("info", "[STAGE 3: QUOTA] Storage Quota: Partition verified within hardware gateway quota limit (64GB threshold).");
        }, 1200);

        let step = 0;
        const totalSteps = mockFiles.length;

        // Process files through stages 4 to 8
        const interval = setInterval(() => {
            step++;
            const pct = Math.round((step / totalSteps) * 100);
            const currentFile = mockFiles[step - 1];

            // Advance through stages 4, 5, 6, 7, 8
            const activeStage = 3 + step;
            updateStageStepper(Math.min(activeStage, 8));

            if (scanBadge) {
                scanBadge.textContent = `STATUS: INSPECTING [STAGE 0${Math.min(activeStage, 8)}]`;
            }

            progressBar.style.width = `${pct}%`;
            statusText.textContent = `Evaluating Heuristics (${pct}%): Stage 0${activeStage}/09 - Inspecting ${currentFile.path}`;

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
                appendLog("success", `[STAGE 8: ALLOW] Verified benign: ${currentFile.path} (TTS Score = ${currentFile.tts})`);
            } else if (currentFile.action === "QUARANTINE") {
                appendLog("warning", `[STAGE 8: QUARANTINE] Isolated to Quarantine SSD (${currentFile.reason}): ${currentFile.path}`);
                addQuarantineRow(currentFile);
            } else if (currentFile.action === "BLOCK") {
                appendLog("danger", `[STAGE 8: BLOCK] Malicious threat blocked from host interface (${currentFile.reason}): ${currentFile.path}`);
            }

            // Update Metrics
            document.getElementById("metric-sessions").textContent = "1";
            document.getElementById("metric-files").textContent = step;
            document.getElementById("metric-quarantine").textContent = mockFiles.filter(f => f.action === "QUARANTINE" && mockFiles.indexOf(f) < step).length;
            document.getElementById("metric-blocked").textContent = mockFiles.filter(f => f.action === "BLOCK" && mockFiles.indexOf(f) < step).length;

            if (step >= totalSteps) {
                clearInterval(interval);

                // Stage 9: SQLite WAL Audit Log
                setTimeout(() => {
                    updateStageStepper(9);
                    isDemoRunning = false;
                    btnRunDemo.disabled = false;
                    btnRunDemo.textContent = "▶️ EXECUTE 9-STAGE SCAN";
                    statusText.textContent = "✅ Stage 09 Complete - Ledger cryptographically sealed in SQLite WAL database";
                    if (scanBadge) {
                        scanBadge.textContent = "AUDIT COMPLETE // ARMED";
                        scanBadge.className = "scan-state-badge";
                        scanBadge.style.background = "rgba(0, 255, 157, 0.15)";
                        scanBadge.style.color = "var(--emerald-neon)";
                        scanBadge.style.border = "1px solid var(--emerald-neon)";
                    }
                    appendLog("info", "[STAGE 9: WAL] Logging Engine: Session audit ledger committed. fsync() flushed to SQLite WAL.");

                    // Add to audit list
                    const auditEntry = document.createElement("div");
                    auditEntry.className = "audit-item";
                    auditEntry.innerHTML = `<span class="badge info">SESSION</span> <span>[Session #GW-9041] 9-Stage Pipeline Completed: 4 file objects examined (2 ALLOW, 1 QUARANTINE, 1 BLOCK)</span>`;
                    auditList.prepend(auditEntry);
                }, 900);
            }
        }, 1100);
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
        if (!logContainer) return;
        const entry = document.createElement("div");
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
});
