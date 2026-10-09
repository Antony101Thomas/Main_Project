# Hardware-Assisted Removable Media Security Gateway (`main-project`)

An independent, embedded security appliance design for inspect untrusted removable storage (USB drives, SD cards) **before** contents are exposed to a host computer. Built for **Raspberry Pi 5 / Pi 4** running Raspberry Pi OS (64-bit).

---

## 🌟 Key Architecture & Workflow

```
[Removable Media] -> [Linux udev Listener] -> [Read-Only Mount & OverlayFS (RAM tmpfs)]
                                                      |
                                                      v
                                        [Multi-Stage Detection Pipeline]
                                          ├─ 1. SHA-256 Hashing (Rust/Cache)
                                          ├─ 2. Magic-Byte / MIME Validation (Rust)
                                          ├─ 3. ClamAV Signature Scanning
                                          ├─ 4. YARA Pattern Rules
                                          └─ 5. Optional AI Risk Assessment
                                                      |
                                                      v
                                           [Policy Decision Engine]
                                          ├─ ALLOW (Expose safe files)
                                          ├─ QUARANTINE (Isolated SSD)
                                          └─ BLOCK (Deny host access)
                                                      |
                                                      v
                                    [FastAPI + WebSockets Live Dashboard]
```

---

## 📁 Repository Directory Structure

```text
main-project/
├── README.md                   # Project overview & documentation
├── .gitignore                  # Git ignore rules
├── docs/                       # Detailed design documentation
│   ├── ARCHITECTURE.md         # System hardware/software architecture
│   └── DETECTION_PIPELINE.md   # Complete 9-stage pipeline guide
├── backend/                    # Python Orchestration & FastAPI Dashboard Backend
│   ├── app/
│   │   ├── main.py             # FastAPI entrypoint & WebSocket handlers
│   │   ├── api/                # REST API routes
│   │   ├── core/               # App configuration & logging
│   │   ├── db/                 # SQLite database models & WAL connection
│   │   ├── mount/              # udev listener & OverlayFS workspace manager
│   │   ├── pipeline/           # Detection pipeline components
│   │   └── policy/             # Policy engine & threat scoring logic
│   ├── requirements.txt
│   └── pyproject.toml
├── scanner_core/               # High-performance Rust hashing & structure validator
│   ├── Cargo.toml
│   └── src/lib.rs
├── rules/                      # Rule bases for YARA and ClamAV
│   ├── yara/
│   │   └── default_rules.yar
│   └── clamav/
│       └── freshclam.conf
├── dashboard/                  # Frontend Web Interface (HTML5/CSS3/JS WebSockets)
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── scripts/                    # Deployment scripts & systemd services
    ├── setup.sh
    └── systemd/hardware-gateway.service
```

---

## 🚀 Getting Started

### Prerequisites (Raspberry Pi OS / Linux)
- Python 3.10+
- Rust toolchain (`cargo`, `rustc`)
- ClamAV daemon (`clamav`, `clamav-daemon`)
- YARA development libraries (`libyara-dev`)
- SQLite 3

### Installation & Setup

1. **Clone & Setup Directory**:
   ```bash
   git init
   ```

2. **Setup Python Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Build Scanner Core (Rust)**:
   ```bash
   cd ../scanner_core
   cargo build --release
   ```

4. **Run the Gateway Backend & Dashboard**:
   ```bash
   cd ../backend
   python -m app.main
   ```
   Access the Web Dashboard at: `http://localhost:8000`

---

## 🔒 Security Principles
- **Read-Only Inspection**: Source media is mounted `ro` (read-only) to protect original evidence/data.
- **RAM Workspace (`tmpfs`)**: OverlayFS uses RAM for scratch writes during archive expansion, keeping host drives clean.
- **Physical Isolation**: Malicious samples are copied to an isolated quarantine partition with strict permission controls.
