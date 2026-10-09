# Detection Pipeline Specification

Each file discovered on an attached removable media passes through a sequential 9-stage analysis pipeline designed to minimize compute costs while maximizing threat detection accuracy.

---

## The 9 Pipeline Stages

### Stage 1: Device Detection & Session Initialization
- **Trigger**: `udev` hotplug event detects block device insertion.
- **Action**: Session ID generated; drive details recorded in SQLite database; notification pushed to Dashboard via WebSocket.

### Stage 2: Read-Only Mounting & OverlayFS Setup
- **Action**: Source partition mounted read-only (`ro`); RAM-backed `tmpfs` OverlayFS workspace established.

### Stage 3: SHA-256 Hashing & Cache Lookup
- **Technology**: Rust scanner core / Python hashlib.
- **Action**: Compute SHA-256 hash. Check against known-safe (whitelisted) and known-malicious (blacklisted) local hash database.

### Stage 4: File Structure & Magic Byte Validation
- **Technology**: Rust magic-byte inspector (`infer` / `magic`).
- **Action**: Verify true MIME type against file extension. Flag extension mismatches (e.g., `document.pdf` containing ELF binary or PE executable header).

### Stage 5: Signature Scan
- **Technology**: ClamAV daemon (`clamd`).
- **Action**: Scan file stream against official and custom ClamAV malware signatures.

### Stage 6: YARA Rules Matching
- **Technology**: YARA rules engine (`yara-python`).
- **Action**: Evaluate compiled YARA rules for suspicious string patterns, shellcode signatures, and packed headers.

### Stage 7: Heuristic AI Risk Assessment (Optional)
- **Technology**: ONNX Runtime.
- **Action**: Run lightweight static feature extraction model to generate a risk score (0.0 – 1.0) for unclassified files.

### Stage 8: Policy Engine Decision
- **Action**: Calculate **Total Threat Score (TTS 0-100)**.
- **Policy Outcomes**:
  - `ALLOW` (TTS < 30 & no deterministic matches): Expose file to safe gateway path.
  - `QUARANTINE` (30 <= TTS < 70 or moderate anomaly): Copy sample to isolated Quarantine SSD.
  - `BLOCK` (TTS >= 70 or ClamAV/YARA match): Deny access, flag threat, recommend safe eject.

### Stage 9: Audit Logging & Dashboard Update
- **Action**: Record per-file findings, execution timestamps, and system status in SQLite WAL database; push update to active Dashboard UI sessions.
