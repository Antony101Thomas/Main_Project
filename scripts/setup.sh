#!/usr/bin/env bash

set -e

echo "========================================================="
echo " Installing Hardware-Assisted Removable Media Gateway "
echo "========================================================="

# 1. Update OS package lists
sudo apt-get update

# 2. Install dependencies
sudo apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    clamav \
    clamav-daemon \
    libyara-dev \
    sqlite3 \
    build-essential \
    curl

# 3. Setup Python virtual environment
cd "$(dirname "$0")/../backend"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 4. Create required runtime directories
sudo mkdir -p /mnt/source_ro /mnt/overlay_tmp /mnt/quarantine
sudo chmod 755 /mnt/source_ro /mnt/overlay_tmp /mnt/quarantine

echo "========================================================="
echo " Gateway Setup Completed Successfully! "
echo "========================================================="
