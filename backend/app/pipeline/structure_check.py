import os

MAGIC_BYTE_MAP = {
    b"\x7fELF": "application/x-executable",
    b"MZ": "application/x-dsexec",
    b"%PDF": "application/pdf",
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG": "image/png",
    b"PK\x03\x04": "application/zip",
}

EXECUTABLE_EXTENSIONS = {".exe", ".dll", ".elf", ".so", ".bin", ".sh", ".bat", ".vbs", ".ps1"}
DOCUMENT_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt", ".docx", ".xlsx"}

class StructureValidator:
    @staticmethod
    def validate_file_structure(file_path: str) -> tuple[str, bool]:
        """
        Reads magic bytes from file header to detect true MIME type
        and flags extension mismatches.
        """
        ext = os.path.splitext(file_path)[1].lower()
        true_mime = "application/octet-stream"

        try:
            with open(file_path, "rb") as f:
                header = f.read(16)
                for magic, mime in MAGIC_BYTE_MAP.items():
                    if header.startswith(magic):
                        true_mime = mime
                        break
        except Exception:
            pass

        # Extension Mismatch Detection
        mismatch = False
        if ext in DOCUMENT_EXTENSIONS and (true_mime.endswith("executable") or true_mime.endswith("dsexec")):
            mismatch = True
        elif ext not in EXECUTABLE_EXTENSIONS and (header.startswith(b"MZ") or header.startswith(b"\x7fELF")):
            mismatch = True

        return true_mime, mismatch
