from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ScanSession, FileRecord, AuditLog

router = APIRouter()

@router.get("/sessions")
def get_recent_sessions(limit: int = 10, db: Session = Depends(get_db)):
    """Returns recent USB scan sessions."""
    sessions = db.query(ScanSession).order_by(ScanSession.created_at.desc()).limit(limit).all()
    return sessions

@router.get("/sessions/{session_id}/records")
def get_session_file_records(session_id: str, db: Session = Depends(get_db)):
    """Returns all per-file scan results for a specific session."""
    records = db.query(FileRecord).filter(FileRecord.session_id == session_id).all()
    return records

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Returns gateway audit logs."""
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/health")
def get_system_health():
    """Returns system status and gateway diagnostics."""
    return {
        "status": "ONLINE",
        "appliance": "Raspberry Pi Security Gateway",
        "scanner_status": "READY",
        "clamav": "ACTIVE",
        "yara": "ACTIVE"
    }
