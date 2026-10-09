# System Architecture & Technical Specifications

## Overview
The Hardware-Assisted Removable Media Security Gateway acts as an intermediary hardware appliance between untrusted USB storage media and host computers.

## Hardware Topology
- **Host Device**: Raspberry Pi 5 (8GB RAM recommended) or Raspberry Pi 4 Model B.
- **Storage Interfaces**:
  - USB 3.0 / USB 2.0 ports for untrusted media connections.
  - Dedicated External SSD interface for Quarantine Storage (isolated mount `/mnt/quarantine`).
- **Power & Status**:
  - Status LEDs: Green (Safe/Allowed), Yellow (Quarantine/Review), Red (Blocked/Malware).
  - Optional Battery Management System (BMS) for standalone portable deployment.

## Software Architecture Layers

### 1. OS & Mount Controls
- **Operating System**: Raspberry Pi OS Lite (64-bit).
- **udev Subsystem**: Monitors USB bus events (`add`, `remove`) via `pyudev`.
- **Mount Isolation**: Source drives are mounted with strict read-only parameters:
  `mount -o ro,noexec,nosuid,nodev /dev/sdX1 /mnt/source_ro`

### 2. OverlayFS Inspection Workspace
To permit scan operations that require temporary writes (such as archive decompression or temporary file metadata extraction) without writing to the source USB:
- **Lower Directory (`lowerdir`)**: `/mnt/source_ro` (Read-only untrusted USB).
- **Upper Directory (`upperdir`)**: `/mnt/overlay_tmp/upper` (RAM-backed `tmpfs`).
- **Work Directory (`workdir`)**: `/mnt/overlay_tmp/work`.
- **Merged View (`merged`)**: `/mnt/overlay_tmp/merged`.

```bash
mount -t overlay overlay -o lowerdir=/mnt/source_ro,upperdir=/mnt/overlay_tmp/upper,workdir=/mnt/overlay_tmp/work /mnt/overlay_tmp/merged
```

### 3. Backend & Dashboard
- **FastAPI Backend**: Provides asynchronous API endpoints for UI controls, session logs, and system metrics.
- **WebSockets Manager**: Real-time push updates for scan progress, file counts, and threat alerts.
- **SQLite Database (WAL Mode)**: High-performance concurrent audit logging (`Write-Ahead Logging`).
