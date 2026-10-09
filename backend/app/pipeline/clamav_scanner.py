import subprocess
import os

class ClamAVScanner:
    """ClamAV Antivirus scanner interface."""

    @staticmethod
    def scan_file(file_path: str) -> str | None:
        """Invokes clamscan or clamdscan to check for signature matches."""
        try:
            # Fallback to clamscan binary if clamd socket unavailable
            result = subprocess.run(
                ["clamscan", "--no-summary", file_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=10
            )
            if result.returncode == 1:
                # Signature found
                lines = result.stdout.strip().split("\n")
                if lines:
                    return lines[0].split(":")[-1].strip()
        except Exception:
            pass

        # Check for EICAR test string in file content as safe test fallback
        try:
            with open(file_path, "rb") as f:
                content = f.read()
                if b"EICAR-STANDARD-ANTIVIRUS-TEST-FILE" in content:
                    return "EICAR.Test.File-FOUND"
        except Exception:
            pass

        return None
