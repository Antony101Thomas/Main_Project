import os
try:
    import yara
except ImportError:
    yara = None

class YaraScanner:
    def __init__(self, rules_path: str):
        self.rules_path = rules_path
        self.compiled_rules = None
        self._load_rules()

    def _load_rules(self):
        if yara and os.path.exists(self.rules_path):
            try:
                self.compiled_rules = yara.compile(filepath=self.rules_path)
            except Exception:
                self.compiled_rules = None

    def scan_file(self, file_path: str) -> list[str]:
        hits = []
        if self.compiled_rules:
            try:
                matches = self.compiled_rules.match(file_path)
                hits = [m.rule for m in matches]
            except Exception:
                pass
        return hits
