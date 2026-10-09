import os
import subprocess
from app.core.config import settings

class OverlayFSManager:
    """Manages Read-Only mounts and OverlayFS RAM workspace creation."""

    @staticmethod
    def setup_workspace(device_node: str, session_id: str) -> tuple[str, str]:
        """
        Mounts the source device read-only and sets up OverlayFS tmpfs layers.
        Returns (source_ro_path, merged_workspace_path).
        """
        session_dir = os.path.join(settings.OVERLAY_BASE_DIR, session_id)
        lower_dir = os.path.join(session_dir, "lower")
        upper_dir = os.path.join(session_dir, "upper")
        work_dir = os.path.join(session_dir, "work")
        merged_dir = os.path.join(session_dir, "merged")

        os.makedirs(lower_dir, exist_ok=True)
        os.makedirs(upper_dir, exist_ok=True)
        os.makedirs(work_dir, exist_ok=True)
        os.makedirs(merged_dir, exist_ok=True)

        # 1. Mount device read-only
        try:
            subprocess.run(
                ["mount", "-o", "ro,noexec,nosuid,nodev", device_node, lower_dir],
                check=False
            )
        except Exception:
            pass

        # 2. Mount OverlayFS
        try:
            overlay_opts = f"lowerdir={lower_dir},upperdir={upper_dir},workdir={work_dir}"
            subprocess.run(
                ["mount", "-t", "overlay", "overlay", "-o", overlay_opts, merged_dir],
                check=False
            )
        except Exception:
            pass

        return lower_dir, merged_dir

    @staticmethod
    def cleanup_workspace(session_id: str):
        """Unmounts OverlayFS and cleans up temporary RAM workspace."""
        session_dir = os.path.join(settings.OVERLAY_BASE_DIR, session_id)
        merged_dir = os.path.join(session_dir, "merged")
        lower_dir = os.path.join(session_dir, "lower")

        try:
            subprocess.run(["umount", "-f", merged_dir], check=False)
            subprocess.run(["umount", "-f", lower_dir], check=False)
        except Exception:
            pass
