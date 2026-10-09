use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::{Read, Result as IoResult};
use std::path::Path;

/// Fast SHA-256 calculation for large files in Rust
pub fn compute_sha256(path: &Path) -> IoResult<String> {
    let mut file = File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 65536];

    loop {
        let count = file.read(&mut buffer)?;
        if count == 0 {
            break;
        }
        hasher.update(&buffer[..count]);
    }

    Ok(format!("{:x}", hasher.finalize()))
}

/// Inspects magic bytes and returns inferred MIME type
pub fn inspect_magic_bytes(path: &Path) -> IoResult<Option<String>> {
    let mut file = File::open(path)?;
    let mut buffer = [0u8; 4096];
    let count = file.read(&mut buffer)?;

    if let Some(kind) = infer::get(&buffer[..count]) {
        Ok(Some(kind.mime_type().to_string()))
    } else {
        Ok(None)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_compute_sha256() {
        let mut file = NamedTempFile::new().unwrap();
        write!(file, "EICAR-STANDARD-ANTIVIRUS-TEST-FILE").unwrap();
        let hash = compute_sha256(file.path()).unwrap();
        assert!(!hash.is_empty());
    }
}
