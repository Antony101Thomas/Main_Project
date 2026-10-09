rule EICAR_Test_File {
    meta:
        description = "Detects EICAR Anti-Virus Test File"
        author = "Security Gateway Team"
        severity = "HIGH"
    strings:
        $eicar = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*" ascii wide
    condition:
        $eicar
}

rule Suspicious_Script_Exec {
    meta:
        description = "Detects embedded powershell or shellcode execution commands"
        severity = "MEDIUM"
    strings:
        $ps = "powershell -ExecutionPolicy Bypass" ascii nocase
        $cmd = "cmd.exe /c start" ascii nocase
    condition:
        any of ($ps, $cmd)
}
