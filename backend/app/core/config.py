import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hardware-Assisted Removable Media Security Gateway"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Storage paths
    MOUNT_BASE_DIR: str = "/mnt/source_ro"
    OVERLAY_BASE_DIR: str = "/mnt/overlay_tmp"
    QUARANTINE_DIR: str = os.path.abspath("./quarantine_storage")
    DATABASE_URL: str = "sqlite:///./gateway_audit.db"

    # Scanner settings
    CLAMAV_SOCKET: str = "/var/run/clamav/clamd.ctl"
    YARA_RULES_PATH: str = os.path.abspath("../rules/yara/default_rules.yar")
    
    # Policy scoring thresholds
    TTS_QUARANTINE_THRESHOLD: int = 30
    TTS_BLOCK_THRESHOLD: int = 70

    class Config:
        case_sensitive = True

settings = Settings()
