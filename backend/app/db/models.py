from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class ScanSession(Base):
    __tablename__ = "scan_sessions"

    id = Column(String(64), primary_key=True, index=True)
    device_name = Column(String(128), nullable=False)
    vendor_id = Column(String(32), nullable=True)
    product_id = Column(String(32), nullable=True)
    filesystem_type = Column(String(32), nullable=True)
    status = Column(String(32), default="INITIALIZING")  # INITIALIZING, SCANNING, COMPLETED, ERROR
    files_scanned = Column(Integer, default=0)
    threats_detected = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    records = relationship("FileRecord", back_populates="session")


class FileRecord(Base):
    __tablename__ = "file_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), ForeignKey("scan_sessions.id"))
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256 = Column(String(64), index=True, nullable=False)
    true_mime = Column(String(128), nullable=True)
    extension_mismatch = Column(Integer, default=0)  # 0 = False, 1 = True
    clamav_result = Column(String(256), nullable=True)
    yara_hits = Column(Text, nullable=True)
    ai_risk_score = Column(Float, default=0.0)
    total_threat_score = Column(Integer, default=0)
    action_taken = Column(String(32), default="ALLOW")  # ALLOW, QUARANTINE, BLOCK
    scanned_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ScanSession", back_populates="records")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_type = Column(String(64), nullable=False)  # DEVICE_CONNECTED, SCAN_START, POLICY_ACTION, ADMIN_OVERRIDE
    severity = Column(String(16), default="INFO")   # INFO, WARNING, ERROR, CRITICAL
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
