import hashlib
import os

class HashScanner:
    @staticmethod
    def calculate_sha256(file_path: str, chunk_size: int = 65536) -> str:
        """Computes SHA-256 digest for a file."""
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(chunk_size):
                sha256.update(chunk)
        return sha256.hexdigest()

    @staticmethod
    def check_known_hash(sha256_hash: str) -> tuple[bool, str | None]:
        """Verifies hash against local blacklist database."""
        # Simulated blacklist check (EICAR hash and sample malware hashes)
        known_malware_hashes = {
            "131f95c51cc819465fa1797f6ccacf9d494aaaff46fa3eac73ae63ffbda8e66c": "EICAR Test File",
            "44d88612fea8a8f36de82e1278abb02f": "Sample Test Malware"
        }
        if sha256_hash in known_malware_hashes:
            return True, known_malware_hashes[sha256_hash]
        return False, None
