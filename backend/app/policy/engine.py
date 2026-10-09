from app.core.config import settings

class PolicyEngine:
    """
    Evaluates detection pipeline indicators and determines final action: ALLOW, QUARANTINE, or BLOCK.
    Calculates Total Threat Score (TTS 0-100).
    """

    @staticmethod
    def evaluate(sha256_matched_malware: bool,
                 extension_mismatch: bool,
                 clamav_threat: str | None,
                 yara_hits: list[str],
                 ai_risk_score: float) -> tuple[int, str, str]:
        
        # Immediate Deterministic Overrides
        if sha256_matched_malware:
            return 100, "BLOCK", "Matched known malware SHA-256 hash blacklist"
        
        if clamav_threat:
            return 100, "BLOCK", f"ClamAV malware signature hit: {clamav_threat}"
        
        if len(yara_hits) > 0:
            return 90, "BLOCK", f"YARA rule hit(s): {', '.join(yara_hits)}"

        # Total Threat Score (TTS) Calculation
        tts = 0

        if extension_mismatch:
            tts += 40  # Deceptive extension anomaly

        if ai_risk_score > 0.5:
            tts += int(ai_risk_score * 30)

        # Classify Action based on TTS Thresholds
        if tts >= settings.TTS_BLOCK_THRESHOLD:
            action = "BLOCK"
            reason = f"High threat score (TTS = {tts})"
        elif tts >= settings.TTS_QUARANTINE_THRESHOLD:
            action = "QUARANTINE"
            reason = f"Moderate threat score / anomaly detected (TTS = {tts})"
        else:
            action = "ALLOW"
            reason = "No threats detected; content safe for gateway exposure"

        return tts, action, reason
